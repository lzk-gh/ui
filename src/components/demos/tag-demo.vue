<template>
  <view class="component-demo">
    <demo-block title="标签类型">
      <view class="demo-row">
        <lk-tag>默认</lk-tag>
        <lk-tag type="primary">主要</lk-tag>
        <lk-tag type="success">成功</lk-tag>
        <lk-tag type="warning">警告</lk-tag>
        <lk-tag type="danger">危险</lk-tag>
      </view>
    </demo-block>

    <demo-block title="可关闭标签">
      <view class="demo-row">
        <lk-tag v-if="tags.tag1" closable @close="tags.tag1 = false">可关闭</lk-tag>
        <lk-tag v-if="tags.tag2" closable type="primary" @close="tags.tag2 = false">主要</lk-tag>
        <lk-tag v-if="tags.tag3" closable type="success" @close="tags.tag3 = false">成功</lk-tag>
        <lk-button v-if="!allTagsVisible" size="medium" @click="resetTags">恢复</lk-button>
      </view>
    </demo-block>

    <demo-block title="标签尺寸">
      <view class="demo-row">
        <lk-tag size="sm">小标签</lk-tag>
        <lk-tag size="md">中等</lk-tag>
        <lk-tag size="lg">大标签</lk-tag>
      </view>
    </demo-block>

    <demo-block title="圆形标签">
      <view class="demo-row">
        <lk-tag round>默认</lk-tag>
      </view>
    </demo-block>

    <demo-block title="可选择标签">
      <view class="demo-row">
        <lk-tag
          v-for="tag in selectableTags"
          :key="tag.name"
          :type="tag.selected ? 'primary' : 'default'"
          @click="toggleTag(tag.name)"
          class="selectable-tag"
        >
          <lk-icon v-if="tag.selected" name="check-circle-fill" class="mr-8" />
          {{ tag.label }}
        </lk-tag>
      </view>
    </demo-block>

    <demo-block title="标签组">
      <view class="tag-group">
        <lk-tag v-for="skill in skills" :key="skill" size="small" type="primary">
          {{ skill }}
        </lk-tag>
      </view>
    </demo-block>
  </view>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

const tags = ref({
  tag1: true,
  tag2: true,
  tag3: true,
});

const allTagsVisible = computed(() => tags.value.tag1 && tags.value.tag2 && tags.value.tag3);

const selectableTags = ref([
  { name: 'vue', label: 'Vue', selected: false },
  { name: 'react', label: 'React', selected: false },
  { name: 'uniapp', label: 'UniApp', selected: true },
]);

const skills = ref(['Vue3', 'TypeScript', 'UniApp', 'Sass', 'Vite']);

const resetTags = () => {
  tags.value = { tag1: true, tag2: true, tag3: true };
  uni.showToast({ title: '标签已恢复', icon: 'none' });
};

const toggleTag = (name: string) => {
  const tag = selectableTags.value.find(t => t.name === name);
  if (tag) {
    tag.selected = !tag.selected;
  }
};
</script>

<style scoped lang="scss">
.component-demo {
  display: flex;
  flex-direction: column;
  gap: 24rpx;
}

.demo-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 16rpx;
}

.mr-8 {
  margin-right: 8rpx;
}

.selectable-tag {
  cursor: pointer;
  &:active {
    transform: scale(0.95);
  }
}

.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: 12rpx;
}
</style>
