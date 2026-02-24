<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import {
  uploadProps,
  uploadEmits,
  UploadStatus,
  type UploadFile,
} from './upload.props';

defineOptions({ name: 'LkUpload' });

const props = defineProps(uploadProps);
const emit = defineEmits(uploadEmits);

/* ───────────── 内部文件列表 ───────────── */

const fileList = ref<UploadFile[]>([...props.modelValue]);

watch(
  () => props.modelValue,
  (v) => {
    fileList.value = [...v];
  },
);

/* ───────────── 内置删除确认弹窗状态 ───────────── */

const deleteConfirmVisible = ref(false);
const pendingDeleteIndex = ref(-1);

/* ───────────── 工具函数 ───────────── */

let _uid = 0;
function genUid(): string {
  return `lk-upload-${Date.now()}-${++_uid}`;
}

/** 是否为图片 url */
function isImageUrl(url: string): boolean {
  if (!url) return false;
  return /\.(png|jpe?g|gif|svg|webp|bmp|ico)(\?.*)?$/i.test(url) ||
    url.startsWith('blob:') ||
    url.startsWith('data:image') ||
    url.startsWith('wxfile://') ||
    url.startsWith('http://tmp');
}

/** 剩余可选数量 */
const remainCount = computed(() => Math.max(0, props.maxCount - fileList.value.length));

/** 是否显示上传按钮 */
const showAddBtn = computed(
  () => props.showUpload && fileList.value.length < props.maxCount && !props.disabled,
);

/* ───────────── 同步外部 ───────────── */

function syncModel(list: UploadFile[]) {
  fileList.value = list;
  emit('update:modelValue', [...list]);
  emit('change', [...list]);
}

/* ───────────── 选择文件 ───────────── */

async function onSelect(e?: Event) {
  if (props.disabled) return;
  if (remainCount.value <= 0) return;
  emit('clickUpload', e as Event);

  // #ifdef MP
  chooseFileMp();
  // #endif
  // #ifdef H5
  chooseFileH5();
  // #endif
}

/* ---------- 小程序端选择 ---------- */

function chooseFileMp() {
  const count = props.multiple ? remainCount.value : 1;

  if (props.accept === 'video') {
    uni.chooseVideo({
      sourceType: props.sourceType as string[],
      compressed: props.sizeType.includes('compressed'),
      success(res: { tempFilePath: string; size: number }) {
        const file: UploadFile = {
          uid: genUid(),
          name: res.tempFilePath?.split('/').pop() || 'video',
          url: res.tempFilePath,
          size: res.size,
          type: 'video/*',
          status: UploadStatus.Ready,
        };
        handleAfterChoose([file]);
      },
    });
    return;
  }

  uni.chooseImage({
    count,
    sizeType: props.sizeType as UniApp.ChooseImageOptions['sizeType'],
    sourceType: props.sourceType as string[],
    success(res: UniApp.ChooseImageSuccessCallbackResult) {
      const paths = Array.isArray(res.tempFilePaths) ? res.tempFilePaths : [];
      const infos = (res.tempFiles as Array<{ size: number }>) || [];
      const items: UploadFile[] = paths.map((p, i) => ({
        uid: genUid(),
        name: p.split('/').pop() || `image_${i}`,
        url: p,
        size: infos[i]?.size,
        type: 'image/*',
        status: UploadStatus.Ready,
      }));
      handleAfterChoose(items);
    },
  });
}

/* ---------- H5 端选择 ---------- */

function chooseFileH5() {
  const input = document.createElement('input');
  input.type = 'file';
  if (props.inputAccept) input.accept = props.inputAccept;
  if (props.multiple && remainCount.value > 1) input.multiple = true;

  input.onchange = () => {
    const rawFiles = Array.from(input.files || []);
    const items: UploadFile[] = rawFiles.slice(0, remainCount.value).map((f) => ({
      uid: genUid(),
      name: f.name,
      url: URL.createObjectURL(f),
      size: f.size,
      type: f.type,
      status: UploadStatus.Ready,
      file: f,
    }));
    handleAfterChoose(items);
  };
  input.click();
}

/* ───────────── 选择后处理 ───────────── */

async function handleAfterChoose(items: UploadFile[]) {
  if (!items.length) return;

  /* 大小校验 */
  const oversized: UploadFile[] = [];
  const valid: UploadFile[] = [];
  for (const f of items) {
    if (f.size && f.size > props.maxSize) {
      oversized.push(f);
    } else {
      valid.push(f);
    }
  }
  if (oversized.length) {
    emit('oversize', oversized.length === 1 ? oversized[0] : oversized);
  }
  if (!valid.length) return;

  /* beforeRead 钩子 */
  if (props.beforeRead) {
    const target = valid.length === 1 ? valid[0] : valid;
    try {
      const pass = await props.beforeRead(target, { index: fileList.value.length });
      if (pass === false) return;
    } catch {
      return;
    }
  }

  /* 合并到列表 */
  const merged = fileList.value.concat(valid).slice(0, props.maxCount);
  syncModel(merged);

  const readTarget = valid.length === 1 ? valid[0] : valid;
  emit('afterRead', readTarget, { index: fileList.value.length - valid.length });

  /* afterRead 回调 prop */
  if (props.afterRead) {
    props.afterRead(readTarget, { index: fileList.value.length - valid.length });
  }

  /* 如果配置了 action 则自动上传 */
  if (props.action) {
    valid.forEach((f) => doUpload(f));
  }
}

/* ───────────── 上传逻辑 ───────────── */

function doUpload(file: UploadFile) {
  file.status = UploadStatus.Uploading;
  file.progress = 0;
  file.message = '上传中...';
  syncModel([...fileList.value]);

  /* 自定义上传函数（可接入 Request 等外部请求工具） */
  if (props.customRequest) {
    props.customRequest({
      file,
      action: props.action,
      name: props.name,
      headers: props.headers,
      data: props.data,
      onProgress(progress: number) {
        file.progress = progress;
        emit('progress', file, { progress });
        syncModel([...fileList.value]);
      },
      onSuccess(response: unknown) {
        file.status = UploadStatus.Success;
        file.progress = 100;
        file.message = '';
        file.response = response;
        syncModel([...fileList.value]);
        emit('success', file, { response });
      },
      onFail(error: unknown) {
        file.status = UploadStatus.Fail;
        file.message = '上传失败';
        syncModel([...fileList.value]);
        emit('fail', file, { error });
        if (props.autoRemoveFail) {
          setTimeout(() => removeFile(fileList.value.indexOf(file)), 1500);
        }
      },
    });
    return;
  }

  /* 内置 uni.uploadFile */
  const uploadTask = uni.uploadFile({
    url: props.action,
    filePath: file.url,
    name: props.name,
    header: props.headers,
    formData: props.data,
    success(res) {
      file.status = UploadStatus.Success;
      file.progress = 100;
      file.message = '';
      file.response = res.data;
      syncModel([...fileList.value]);
      emit('success', file, { response: res.data });
    },
    fail(err) {
      file.status = UploadStatus.Fail;
      file.message = '上传失败';
      syncModel([...fileList.value]);
      emit('fail', file, { error: err });

      if (props.autoRemoveFail) {
        setTimeout(() => removeFile(fileList.value.indexOf(file)), 1500);
      }
    },
  });

  /* 监听进度 */
  if (uploadTask && typeof uploadTask.onProgressUpdate === 'function') {
    uploadTask.onProgressUpdate((res) => {
      file.progress = res.progress;
      emit('progress', file, { progress: res.progress });
      syncModel([...fileList.value]);
    });
  }
}

/* ───────────── 删除文件 ───────────── */

async function removeFile(index: number) {
  if (index < 0 || index >= fileList.value.length) return;
  const file = fileList.value[index];

  if (props.beforeDelete) {
    try {
      const pass = await props.beforeDelete(file, { index });
      if (pass === false) return;
    } catch {
      return;
    }
  }

  doRemove(index);
}

function doRemove(index: number) {
  const file = fileList.value[index];
  if (!file) return;
  const next = [...fileList.value];
  next.splice(index, 1);
  syncModel(next);
  emit('delete', file, { index });
}

/** 内置确认删除（通过 lk-modal） */
function confirmRemove(index: number) {
  pendingDeleteIndex.value = index;
  deleteConfirmVisible.value = true;
}

function onDeleteConfirm() {
  const idx = pendingDeleteIndex.value;
  deleteConfirmVisible.value = false;
  pendingDeleteIndex.value = -1;
  if (idx >= 0) doRemove(idx);
}

function onDeleteCancel() {
  deleteConfirmVisible.value = false;
  pendingDeleteIndex.value = -1;
}

/* ───────────── 预览图片 ───────────── */

function onPreview(index: number) {
  const file = fileList.value[index];
  emit('clickPreview', file, { index });

  if (!props.previewImage) return;
  if (!isImageUrl(file.url)) return;

  const urls = fileList.value.filter((f) => isImageUrl(f.url)).map((f) => f.url);
  const current = file.url;

  // #ifdef MP
  uni.previewImage({ current, urls });
  // #endif
  // #ifdef H5
  uni.previewImage({ current, urls });
  // #endif
}

/* ───────────── 重新上传 ───────────── */

function retryUpload(index: number) {
  const file = fileList.value[index];
  if (file.status !== UploadStatus.Fail) return;
  doUpload(file);
}

/* ───────────── 暴露方法 ───────────── */

defineExpose({
  /** 手动选择文件 */
  chooseFile: onSelect,
  /** 重新上传指定文件 */
  retryUpload,
  /** 删除指定文件（直接删除，不弹窗） */
  removeFile,
  /** 确认删除文件（弹出 lk-modal 确认） */
  confirmRemove,
  /** 清空所有文件 */
  clearFiles: () => syncModel([]),
});
</script>

<template>
  <view class="lk-upload" :class="{ 'is-disabled': disabled }">
    <!-- 已选文件列表 -->
    <view
      v-for="(f, i) in fileList"
      :key="f.uid"
      class="lk-upload__item"
      @click="onPreview(i)"
    >
      <!-- 预览图 -->
      <image
        v-if="isImageUrl(f.url)"
        :src="f.thumb || f.url"
        :mode="imageFit"
        class="lk-upload__img"
      />
      <view v-else class="lk-upload__file">
        <lk-icon name="file-earmark" size="44" />
        <text class="lk-upload__file-name">{{ f.name }}</text>
      </view>

      <!-- 上传中遮罩 -->
      <view v-if="f.status === 'uploading'" class="lk-upload__mask">
        <view class="lk-upload__progress">
          <view class="lk-upload__progress-bar" :style="{ width: (f.progress || 0) + '%' }" />
        </view>
        <text class="lk-upload__mask-text">{{ f.progress || 0 }}%</text>
      </view>

      <!-- 上传失败遮罩 -->
      <view v-if="f.status === 'fail'" class="lk-upload__mask lk-upload__mask--fail" @click.stop="retryUpload(i)">
        <lk-icon name="arrow-clockwise" size="36" />
        <text class="lk-upload__mask-text">{{ f.message || '上传失败' }}</text>
      </view>

      <!-- 删除按钮 -->
      <view
        v-if="deletable && !disabled && f.status !== 'uploading'"
        class="lk-upload__del"
        @click.stop="removeFile(i)"
      >
        <lk-icon name="x" size="24" color="var(--lk-upload-del-icon-color, var(--lk-color-text-inverse))" />
      </view>

      <!-- 成功角标 -->
      <view v-if="f.status === 'success'" class="lk-upload__status-icon">
        <lk-icon name="check" size="22" color="#fff" />
      </view>
    </view>

    <!-- 上传按钮 -->
    <view v-if="showAddBtn" class="lk-upload__add" @click="onSelect">
      <slot name="trigger">
        <lk-icon :name="uploadIcon" size="44" />
        <text v-if="uploadText" class="lk-upload__add-text">{{ uploadText }}</text>
      </slot>
      <text v-if="maxCount < 99" class="lk-upload__count">
        {{ fileList.length }}/{{ maxCount }}
      </text>
    </view>

    <!-- 内置删除确认弹窗 -->
    <lk-modal
      v-model="deleteConfirmVisible"
      title="删除确认"
      @confirm="onDeleteConfirm"
      @cancel="onDeleteCancel"
    >
      <text>确定要删除该文件吗？</text>
    </lk-modal>
  </view>
</template>

<style lang="scss">
@use './index.scss';
</style>
