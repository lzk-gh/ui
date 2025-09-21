<template>
  <view :class="['demo-page', themeClass]">

    <!-- 顶部导航 + 快速锚点 -->
    <lk-navbar title="Lucky UI 演示" left-text="返回" :show-back="false">
      <template #right>
        <view class="theme-toggle" @click="toggleTheme">
          <lk-icon :name="theme==='dark' ? 'sun' : 'moon'" size="28" />
          <text class="ml-8">{{ theme==='dark' ? '亮色' : '暗色' }}</text>
        </view>
      </template>
    </lk-navbar>

    <view class="anchor-bar">
      <view
          v-for="a in anchors"
          :key="a.id"
          class="anchor-item"
          @click="scrollTo(a.id)"
      >{{ a.short }}</view>
    </view>

    <!-- 导航 / 通知 / Segmented / 分页 -->
    <demo-block id="nav" title="导航 / 通知 / Segmented / 分页">
      <lk-notice-bar
          text="🎉 Lucky UI 正在扩展第四批组件（日期时间 / 级联 / 虚拟列表 / 轮播）。欢迎反馈！"
          closeable
          @close="log('关闭公告')"
      />
      <view class="row wrap">
        <lk-breadcrumb separator=">">
          <lk-breadcrumb-item to="/pages/demo/index">首页</lk-breadcrumb-item>
          <lk-breadcrumb-item>演示</lk-breadcrumb-item>
          <lk-breadcrumb-item clickable="false">当前</lk-breadcrumb-item>
        </lk-breadcrumb>
      </view>
      <view class="row wrap">
        <lk-segmented v-model="segVal" :options="segOptions" />
        <lk-pagination :total="238" v-model="page" :page-size="10" />
      </view>
      <view class="desc">
        Segmented: {{ segVal }} / Page: {{ page }}
      </view>
    </demo-block>

    <!-- 表单基础 -->
    <demo-block id="form" title="表单基础与校验">
      <lk-form ref="formRef" :model="form" :rules="rules" @validate="onFormValidate">
        <lk-form-item prop="username" label="用户名">
          <lk-input v-model="form.username" prop="username" placeholder="请输入用户名" clearable />
        </lk-form-item>
        <lk-form-item prop="password" label="密码">
          <lk-input v-model="form.password" type="password" prop="password" placeholder="不少于 6 位" clearable />
        </lk-form-item>
        <lk-form-item prop="gender" label="性别">
          <lk-radio-group v-model="form.gender">
            <lk-radio label="male">男</lk-radio>
            <lk-radio label="female">女</lk-radio>
            <lk-radio label="other">其他</lk-radio>
          </lk-radio-group>
        </lk-form-item>
        <lk-form-item prop="hobbies" label="兴趣">
          <lk-checkbox-group v-model="form.hobbies" :max="5">
            <lk-checkbox label="music">音乐</lk-checkbox>
            <lk-checkbox label="movie">电影</lk-checkbox>
            <lk-checkbox label="game">游戏</lk-checkbox>
            <lk-checkbox label="sport">运动</lk-checkbox>
            <lk-checkbox label="travel">旅行</lk-checkbox>
          </lk-checkbox-group>
        </lk-form-item>
        <lk-form-item prop="notify" label="通知">
          <lk-switch v-model="form.notify" :before-change="beforeNotifyChange" />
          <text class="inline-hint">{{ form.notify ? '已开启' : '已关闭' }}</text>
        </lk-form-item>
        <lk-form-item prop="intro" label="简介">
          <lk-textarea v-model="form.intro" :maxlength="120" show-count placeholder="简单介绍自己" prop="intro" />
        </lk-form-item>
        <lk-form-item prop="agree" label="协议">
          <lk-checkbox v-model="form.agree" :true-value="true" :false-value="false">
            我已阅读并同意 <text class="link" @click.stop="openAgreement">《用户协议》</text>
          </lk-checkbox>
        </lk-form-item>
        <view class="form-actions">
          <lk-button block size="large" :loading="submitting" @click="handleSubmit">
            <template #loading><lk-icon name="arrow-repeat" class="spin mr-8" /></template>
            提交
          </lk-button>
          <lk-button block size="large" variant="outline" @click="handleReset">重置</lk-button>
        </view>
      </lk-form>
      <view v-if="showResult" class="result-box">
        <text class="result-title">提交结果</text>
        <text class="json">{{ prettyForm }}</text>
      </view>
    </demo-block>

    <!-- 输入扩展 -->
    <demo-block id="inputs" title="Input / Textarea 扩展">
      <view class="row wrap">
        <view class="input-demo">
          <text class="tip">可清除 + 计数</text>
          <lk-input v-model="extra.note" placeholder="备注 (最多 20 字)" :maxlength="20" show-count clearable />
        </view>
        <view class="input-demo">
          <text class="tip">数字输入</text>
          <lk-input v-model="extra.amount" type="number" placeholder="数量" />
        </view>
        <view class="input-demo full">
          <text class="tip">自适应 Textarea (2~6 行)</text>
          <lk-textarea v-model="extra.long" :maxlength="240" :auto-size="{minRows:2,maxRows:6}" show-count placeholder="多行文本自动高度" />
        </view>
      </view>
      <view class="desc">
        note: {{ extra.note || '无' }} / amount: {{ extra.amount || 0 }} / long: {{ extra.long.length }} chars
      </view>
    </demo-block>

    <!-- 日期 / 时间 / 范围 / DateTime -->
    <demo-block id="datetime" title="日期 / 时间 / 范围 / DateTime">
      <view class="row wrap">
        <view class="picker-box">
          <text class="tip">日期 (Popup)</text>
          <lk-date-picker v-model="pickedDate" placeholder="选择日期" />
        </view>
        <view class="picker-box">
          <text class="tip">时间 TimePicker</text>
          <lk-time-picker v-model="timeVal" />
        </view>
        <view class="picker-box">
          <text class="tip">日期范围</text>
          <lk-date-range-picker v-model="rangeVal" />
        </view>
        <view class="picker-box">
          <text class="tip">日期时间</text>
          <lk-date-time-picker v-model="dateTimeVal" />
        </view>
        <view class="picker-box calendar-box">
          <text class="tip">内联 Calendar</text>
          <lk-calendar v-model="inlineDate" @change="log('选择日期: '+ inlineDate)" />
        </view>
      </view>
      <view class="desc">
        date: {{ pickedDate || '空' }} |
        time: {{ timeVal || '空' }} |
        range: {{ rangeVal.length? rangeVal.join(' ~ ') : '空' }} |
        dateTime: {{ dateTimeVal || '空' }} |
        inline: {{ inlineDate || '空' }}
      </view>
    </demo-block>

    <!-- 级联 / 树 / 虚拟列表 -->
    <demo-block id="casc-tree" title="Cascader / Tree / VirtualList">
      <view class="row wrap">
        <view class="picker-box">
          <text class="tip">级联选择</text>
          <lk-cascader v-model="cascVal" :options="cascOptions" />
        </view>
        <view class="tree-box">
          <text class="tip">树 (可勾选)</text>
          <lk-tree v-model="treeChecked" :data="treeData" />
        </view>
        <view class="vl-box">
          <text class="tip">虚拟列表示例 (200 行)</text>
          <lk-virtual-list
              :items="bigList"
              :item-height="72"
              :height="400"
              key-field="id"
          >
            <template #default="{ item }">
              <view class="vl-row">#{{ item.id }} - {{ item.text }}</view>
            </template>
          </lk-virtual-list>
        </view>
      </view>
      <view class="desc">
        cascader: {{ cascVal.join(' / ') || '空' }} | tree checked: {{ treeChecked.join(',') || '空' }}
      </view>
    </demo-block>

    <!-- Carousel -->
    <demo-block id="carousel" title="Carousel / Swiper">
      <lk-carousel v-model="carouselIdx" :autoplay="true" :interval="2600" style="width:100%;height:320rpx;">
        <lk-carousel-item v-for="s in carouselSlides" :key="s.id">
          <view class="carousel-slide" :style="{ background:s.bg }">
            <text>{{ s.text }}</text>
          </view>
        </lk-carousel-item>
      </lk-carousel>
      <view class="desc">当前轮播索引：{{ carouselIdx }}</view>
    </demo-block>

    <!-- Switch / Stepper / Slider / Rate -->
    <demo-block id="switches" title="Switch / Stepper / Slider / Rate">
      <view class="row wrap">
        <view class="cluster">
          <text class="cluster__title">Switch beforeChange</text>
          <lk-switch v-model="confirmSwitch" :before-change="confirmToggle" />
          <text class="note small">{{ confirmSwitch ? '已启用' : '已关闭' }}</text>
        </view>
        <view class="cluster">
          <text class="cluster__title">Stepper</text>
          <lk-stepper v-model="stepVal" :min="0" :max="10" />
        </view>
        <view class="cluster stepper-inline">
          <text class="cluster__title">Slider ({{ sliderVal }})</text>
          <lk-slider v-model="sliderVal" :min="0" :max="100" />
        </view>
        <view class="cluster">
          <text class="cluster__title">Rate ({{ rateVal }})</text>
          <lk-rate v-model="rateVal" :allow-half="true" />
        </view>
      </view>
    </demo-block>

    <!-- Tabs + Progress + Loading -->
    <demo-block id="tabs" title="Tabs + Progress + Loading">
      <lk-tabs v-model="activeTab" type="card">
        <lk-tab-pane name="base" label="基础">
          <view class="pad">
            <lk-progress :percentage="progress1" striped animated />
            <lk-button size="small" class="mt-16" @click="incProgress">进度 +10%</lk-button>
          </view>
        </lk-tab-pane>
        <lk-tab-pane name="circle" label="环形">
          <view class="pad center">
            <lk-progress type="circle" :percentage="progress1" :size="160" />
          </view>
        </lk-tab-pane>
        <lk-tab-pane name="loading" label="加载">
          <view class="pad row wrap">
            <lk-loading variant="spinner" text="Spinner" />
            <lk-loading variant="dots" text="Dots" />
            <lk-loading variant="bar" text="Bar" />
          </view>
        </lk-tab-pane>
      </lk-tabs>
    </demo-block>

    <!-- Tag / Badge / Avatar -->
    <demo-block id="tags" title="Tag / Badge / Avatar">
      <view class="row wrap tag-group">
        <lk-tag>默认</lk-tag>
        <lk-tag type="outline">Outline</lk-tag>
        <lk-tag type="soft" closable @close="log('close tag')">Closable</lk-tag>
        <lk-tag size="lg">Large</lk-tag>
        <lk-tag size="sm">Small</lk-tag>
        <lk-badge :value="12"><lk-button size="small">消息</lk-button></lk-badge>
        <lk-badge dot><lk-button size="small" variant="outline">提醒</lk-button></lk-badge>
        <lk-badge :value="188" :max="99"><lk-icon name="bell" size="40" /></lk-badge>
        <lk-avatar text="A" />
        <lk-avatar text="UX" size="60" shape="rounded" />
        <lk-avatar text="L" size="72" shape="square" />
      </view>
    </demo-block>

    <!-- Image / Skeleton / Upload -->
    <demo-block id="image" title="Image / Skeleton / Upload">
      <view class="row wrap">
        <lk-image
            src="https://picsum.photos/200/200?random=1"
            width="200rpx"
            height="200rpx"
            radius="var(--lk-radius-lg)"
            @click="toast('预览图片')"
            preview
        />
        <lk-image
            src="https://picsum.photos/400/260?random=2"
            width="400rpx"
            height="260rpx"
            radius="var(--lk-radius-lg)"
        />
        <lk-skeleton :loading="skeletonLoading" avatar :rows="3" :row-width="['80%','60%','90%']" />
        <lk-button size="small" variant="outline" @click="toggleSkeleton">
          {{ skeletonLoading ? '结束骨架屏' : '再次加载' }}
        </lk-button>
      </view>
      <view class="upload-wrapper">
        <lk-upload v-model="uploadFiles" :max="6" @change="log('上传列表: '+uploadFiles.length)" />
      </view>
      <view class="desc">上传文件数: {{ uploadFiles.length }}</view>
    </demo-block>

    <!-- Card / Cell / Collapse / Divider -->
    <demo-block id="card" title="Card / Cell / Collapse / Divider">
      <lk-card title="示例卡片" sub-title="副标题" shadow="base" hoverable>
        <text>这是卡片内容，演示通用容器类型。点击下方按钮展示 Popup / Toast。</text>
        <template #footer>
          <lk-button size="small" variant="outline" @click="popupShow=true">Popup</lk-button>
          <lk-button size="small" variant="outline" @click="showSuccessToast()">Toast</lk-button>
        </template>
      </lk-card>
      <lk-divider text="分组设置" />
      <lk-cell-group title="设置">
        <lk-cell title="个人资料" value="完善中" arrow clickable @click="toast('进入资料')" icon="user" />
        <lk-cell title="通知开关" center>
          <template #value>
            <lk-switch v-model="form.notify" />
          </template>
        </lk-cell>
        <lk-cell title="关于" label="版本 0.1.0" arrow clickable @click="toast('关于页面')" />
      </lk-cell-group>

      <lk-divider dashed />
      <lk-collapse v-model="collapseVals">
        <lk-collapse-item name="a" title="折叠面板 A">
          内容 A：Lucky UI 主题统一。
        </lk-collapse-item>
        <lk-collapse-item name="b" title="折叠面板 B">
          内容 B：使用品牌变量。
        </lk-collapse-item>
        <lk-collapse-item name="c" title="折叠面板 C">
          内容 C：支持多开。
        </lk-collapse-item>
      </lk-collapse>
    </demo-block>

    <!-- Steps / Timeline -->
    <demo-block id="steps" title="Steps / Timeline">
      <lk-steps :current="stepsCurrent" @change="log('Steps 改变 '+$event)">
        <lk-step v-for="(s,i) in stepsData" :key="i" :index="i" :title="s.title" :sub="s.sub" />
      </lk-steps>
      <view class="row wrap">
        <lk-button size="small" variant="outline" @click="prevStep" :disabled="stepsCurrent<=0">上一步</lk-button>
        <lk-button size="small" @click="nextStep" :disabled="stepsCurrent>=stepsData.length-1">下一步</lk-button>
      </view>
      <lk-divider dashed />
      <lk-timeline>
        <lk-timeline-item time="09:00" hollow>系统初始化</lk-timeline-item>
        <lk-timeline-item time="10:30">加载组件库</lk-timeline-item>
        <lk-timeline-item time="11:10">接入业务页面</lk-timeline-item>
        <lk-timeline-item time="12:00">完成演示编排</lk-timeline-item>
      </lk-timeline>
    </demo-block>

    <!-- Tooltip / Dropdown / Drawer -->
    <demo-block id="tooltip" title="Tooltip / Dropdown / Drawer">
      <view class="row wrap">
        <lk-tooltip content="这是一个提示信息">
          <lk-button size="small" variant="outline">Hover 提示</lk-button>
        </lk-tooltip>

        <lk-tooltip trigger="click" placement="bottom" content="点击触发">
          <lk-button size="small" variant="outline">Click Tooltip</lk-button>
        </lk-tooltip>

        <lk-dropdown v-model="dropdownVal">
          <lk-button size="small" variant="outline">
            Dropdown: {{ dropdownVal || '请选择' }}
            <lk-icon name="arrow-down" class="ml-8" />
          </lk-button>
          <template #menu>
            <lk-dropdown-item name="apple">苹果</lk-dropdown-item>
            <lk-dropdown-item name="banana">香蕉</lk-dropdown-item>
            <lk-dropdown-item name="orange">橘子</lk-dropdown-item>
          </template>
        </lk-dropdown>

        <lk-button size="small" variant="outline" @click="drawerShow=true">打开 Drawer</lk-button>
      </view>
      <view class="desc">Dropdown 选中: {{ dropdownVal || '无' }}</view>
    </demo-block>

    <!-- 按钮 & 图标 -->
    <demo-block id="buttons" title="Button / Icon">
      <view class="row wrap">
        <lk-button @click="toast('默认')">默认</lk-button>
        <lk-button variant="outline" @click="toast('Outline')"><lk-icon name="gear" class="mr-8" />设置</lk-button>
        <lk-button variant="soft"><lk-icon name="bell" class="mr-8" />通知</lk-button>
        <lk-button variant="danger"><lk-icon name="trash" class="mr-8" />删除</lk-button>
        <lk-button shape="circle" size="small"><lk-icon name="search" /></lk-button>
        <lk-button shape="circle" variant="outline" size="small"><lk-icon name="heart" /></lk-button>
        <lk-button :loading="iconLoading" @click="triggerIconLoading">
          <template #loading><lk-icon name="arrow-repeat" class="spin mr-8" /></template>
          异步操作
        </lk-button>
      </view>
    </demo-block>

    <!-- Icons -->
    <demo-block id="icons" title="Icons (点击高亮)">
      <view class="icon-grid">
        <view
            v-for="ic in commonIcons"
            :key="ic"
            class="icon-cell"
            :class="{ 'is-picked': pickedIcon === ic }"
            @click="pickedIcon = ic"
        >
          <lk-icon :name="ic" size="34" />
          <text class="icon-name">{{ ic }}</text>
        </view>
      </view>
      <view class="desc">当前选中: {{ pickedIcon || '无' }}</view>
    </demo-block>

    <!-- 浮层 / 模态 / 弹出 -->
    <demo-block id="layers" title="Overlay / Modal / Popup / ActionSheet / Drawer / Toast">
      <view class="row wrap">
        <lk-button size="small" variant="outline" @click="showOverlay = true">Overlay</lk-button>
        <lk-button size="small" variant="outline" @click="showModal = true">Modal</lk-button>
        <lk-button size="small" variant="outline" @click="popupShow = true">Popup</lk-button>
        <lk-button size="small" variant="outline" @click="sheetShow = true">ActionSheet</lk-button>
        <lk-button size="small" variant="outline" @click="showSuccessToast()">Toast</lk-button>
        <lk-button size="small" variant="outline" @click="toastStore.show('全局队列 Toast')">队列 Toast</lk-button>
      </view>
      <lk-overlay v-model:show="showOverlay" />
      <lk-modal v-model="showModal" title="确认操作" @confirm="confirmModal">
        <text>模态框内容...</text>
      </lk-modal>
      <lk-popup v-model="popupShow" position="bottom">
        <view style="padding:40rpx 32rpx">
          <text style="font-size:28rpx;">底部 Popup 内容</text>
          <view style="margin-top:32rpx;">
            <lk-button size="small" variant="outline" @click="popupShow=false">关闭</lk-button>
          </view>
        </view>
      </lk-popup>
      <lk-action-sheet
          v-model="sheetShow"
          title="更多操作"
          description="选择一个操作继续"
          :actions="sheetActions"
          @select="onSheetSelect"
      />
      <lk-drawer v-model="drawerShow" side="right" title="示例 Drawer">
        <view style="display:flex;flex-direction:column;gap:24rpx;">
          <text>放置设置 / 表单等内容。</text>
          <lk-button size="small" variant="outline" @click="drawerShow=false">关闭</lk-button>
        </view>
      </lk-drawer>
      <lk-toast v-model="toastShow" :message="toastMsg" position="bottom" />
      <lk-toast-manager />
    </demo-block>

    <!-- 日志 -->
    <demo-block id="logs" title="事件日志 (最近 12 条)">
      <view class="row wrap">
        <lk-button size="small" @click="pushLog('手动添加日志')"><lk-icon name="play" class="mr-8" />添加日志</lk-button>
        <lk-button size="small" variant="outline" @click="clearLog">清空日志</lk-button>
        <lk-button size="small" variant="outline" @click="resetAll">重置所有状态</lk-button>
      </view>
      <view class="event-log">
        <text v-for="(e,i) in eventLog.slice(-12)" :key="i">{{ e }}</text>
      </view>
    </demo-block>


    </view>

    <view style="margin-bottom:40rpx;">当前: {{ current }}</view>

  <lk-tabbar v-model="active"
             centralFab
             :fabIndex="2"
             fabIndexPositionStrategy="between"
             :fabSize="120"
             :fabElevate="36"
             fabAvoidOverlap
             :fabAvoidPadding="40">
    <lk-tabbar-item name="home" icon="home">首页</lk-tabbar-item>
    <lk-tabbar-item name="discover" icon="compass">发现</lk-tabbar-item>
    <lk-tabbar-item name="message" icon="message">消息</lk-tabbar-item>
    <lk-tabbar-item name="mine" icon="user">我的</lk-tabbar-item>

    <template #fab>
      <lk-icon name="plus" size="56" />
    </template>
  </lk-tabbar>

<!--    <lk-tabbar-->
<!--        v-model="current"-->
<!--        variant="outline"-->
<!--        shape="square"-->
<!--        active-effect="underline"-->
<!--        label-position="hidden"-->
<!--        central-fab-->
<!--        fab-icon="plus"-->
<!--        active-bg-color="var(&#45;&#45;lk-color-primary-bg-soft)"-->
<!--        underline-color="var(&#45;&#45;lk-color-primary)"-->
<!--        :height="108"-->
<!--        @fabClick="log('fab')"-->
<!--    >-->
<!--      <lk-tabbar-item name="home" icon="chat">首页</lk-tabbar-item>-->
<!--      <lk-tabbar-item name="msg" icon="chat" badge="12">消息</lk-tabbar-item>-->
<!--      <lk-tabbar-item name="me" icon="bell" active-color="#ff5722">我的</lk-tabbar-item>-->
<!--    </lk-tabbar>-->
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTheme } from '@/uni_modules/lucky-ui/theme';
import { toastStore } from '@/uni_modules/lucky-ui/components/lk-toast/toast-manager';

const current = ref('home');

/* Block */
import DemoBlock from '@/uni_modules/lucky-ui/components/demo-block/demo-block.vue';

/* 导航 */
import LkNavbar from '@/uni_modules/lucky-ui/components/lk-navbar/lk-navbar.vue';
import LkTabbar from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar.vue';
import LkTabbarItem from '@/uni_modules/lucky-ui/components/lk-tabbar/lk-tabbar-item.vue';
import LkBreadcrumb from '@/uni_modules/lucky-ui/components/lk-breadcrumb/lk-breadcrumb.vue';
import LkBreadcrumbItem from '@/uni_modules/lucky-ui/components/lk-breadcrumb/lk-breadcrumb-item.vue';

/* 基础表单 */
import LkForm from '@/uni_modules/lucky-ui/components/lk-form/lk-form.vue';
import LkFormItem from '@/uni_modules/lucky-ui/components/lk-form/lk-form-item.vue';
import LkInput from '@/uni_modules/lucky-ui/components/lk-input/lk-input.vue';
import LkTextarea from '@/uni_modules/lucky-ui/components/lk-textarea/lk-textarea.vue';
import LkRadioGroup from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio-group.vue';
import LkRadio from '@/uni_modules/lucky-ui/components/lk-radio/lk-radio.vue';
import LkCheckboxGroup from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox-group.vue';
import LkCheckbox from '@/uni_modules/lucky-ui/components/lk-checkbox/lk-checkbox.vue';
import LkSwitch from '@/uni_modules/lucky-ui/components/lk-switch/lk-switch.vue';

/* 控件 */
import LkButton from '@/uni_modules/lucky-ui/components/lk-button/lk-button.vue';
import LkIcon from '@/uni_modules/lucky-ui/components/lk-icon/lk-icon.vue';
import LkTag from '@/uni_modules/lucky-ui/components/lk-tag/lk-tag.vue';
import LkBadge from '@/uni_modules/lucky-ui/components/lk-badge/lk-badge.vue';
import LkAvatar from '@/uni_modules/lucky-ui/components/lk-avatar/lk-avatar.vue';
import LkLoading from '@/uni_modules/lucky-ui/components/lk-loading/lk-loading.vue';
import LkProgress from '@/uni_modules/lucky-ui/components/lk-progress/lk-progress.vue';
import LkTabs from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tabs.vue';
import LkTabPane from '@/uni_modules/lucky-ui/components/lk-tabs/lk-tab-pane.vue';
import LkSelect from '@/uni_modules/lucky-ui/components/lk-select/lk-select.vue';
import LkOption from '@/uni_modules/lucky-ui/components/lk-select/lk-option.vue';
import LkStepper from '@/uni_modules/lucky-ui/components/lk-stepper/lk-stepper.vue';
import LkSlider from '@/uni_modules/lucky-ui/components/lk-slider/lk-slider.vue';
import LkRate from '@/uni_modules/lucky-ui/components/lk-rate/lk-rate.vue';
import LkSegmented from '@/uni_modules/lucky-ui/components/lk-segmented/lk-segmented.vue';
import LkPagination from '@/uni_modules/lucky-ui/components/lk-pagination/lk-pagination.vue';

/* 日期时间新增 */
import LkDatePicker from '@/uni_modules/lucky-ui/components/lk-date-picker/lk-date-picker.vue';
import LkDateRangePicker from '@/uni_modules/lucky-ui/components/lk-date-range-picker/lk-date-range-picker.vue';
import LkTimePicker from '@/uni_modules/lucky-ui/components/lk-time-picker/lk-time-picker.vue';
import LkDateTimePicker from '@/uni_modules/lucky-ui/components/lk-date-time-picker/lk-date-time-picker.vue';
import LkCalendar from '@/uni_modules/lucky-ui/components/lk-calendar/lk-calendar.vue';

/* 级联 / 树 / 虚拟列表 */
import LkCascader from '@/uni_modules/lucky-ui/components/lk-cascader/lk-cascader.vue';
import LkTree from '@/uni_modules/lucky-ui/components/lk-tree/lk-tree.vue';
import LkTreeNode from '@/uni_modules/lucky-ui/components/lk-tree/lk-tree-node.vue';
import LkVirtualList from '@/uni_modules/lucky-ui/components/lk-virtual-list/lk-virtual-list.vue';

/* 轮播 */
import LkCarousel from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel.vue';
import LkCarouselItem from '@/uni_modules/lucky-ui/components/lk-carousel/lk-carousel-item.vue';

/* 展示 */
import LkImage from '@/uni_modules/lucky-ui/components/lk-image/lk-image.vue';
import LkSkeleton from '@/uni_modules/lucky-ui/components/lk-skeleton/lk-skeleton.vue';
import LkCard from '@/uni_modules/lucky-ui/components/lk-card/lk-card.vue';
import LkCellGroup from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell-group.vue';
import LkCell from '@/uni_modules/lucky-ui/components/lk-cell/lk-cell.vue';
import LkDivider from '@/uni_modules/lucky-ui/components/lk-divider/lk-divider.vue';
import LkSteps from '@/uni_modules/lucky-ui/components/lk-steps/lk-steps.vue';
import LkStep from '@/uni_modules/lucky-ui/components/lk-steps/lk-step.vue';
import LkTimeline from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline.vue';
import LkTimelineItem from '@/uni_modules/lucky-ui/components/lk-timeline/lk-timeline-item.vue';
import LkNoticeBar from '@/uni_modules/lucky-ui/components/lk-notice-bar/lk-notice-bar.vue';

/* 浮层 */
import LkOverlay from '@/uni_modules/lucky-ui/components/lk-overlay/lk-overlay.vue';
import LkModal from '@/uni_modules/lucky-ui/components/lk-modal/lk-modal.vue';
import LkPopup from '@/uni_modules/lucky-ui/components/lk-popup/lk-popup.vue';
import LkActionSheet from '@/uni_modules/lucky-ui/components/lk-action-sheet/lk-action-sheet.vue';
import LkToast from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast.vue';
import LkDrawer from '@/uni_modules/lucky-ui/components/lk-drawer/lk-drawer.vue';
import LkTooltip from '@/uni_modules/lucky-ui/components/lk-tooltip/lk-tooltip.vue';
import LkDropdown from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown.vue';
import LkDropdownItem from '@/uni_modules/lucky-ui/components/lk-dropdown/lk-dropdown-item.vue';
import LkCollapse from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse.vue';
import LkCollapseItem from '@/uni_modules/lucky-ui/components/lk-collapse/lk-collapse-item.vue';

/* 其它 */
import LkUpload from '@/uni_modules/lucky-ui/components/lk-upload/lk-upload.vue';
import LkToastManager from '@/uni_modules/lucky-ui/components/lk-toast/lk-toast-manager.vue';

/* Theme */
const { theme, toggleTheme } = useTheme();
const themeClass = computed(() => theme.value === 'dark' ? 'lk-theme-dark' : 'lk-theme-light');

/* Anchors */
const anchors = [
  { id:'nav', short:'导航' },
  { id:'form', short:'表单' },
  { id:'inputs', short:'输入' },
  { id:'datetime', short:'日期' },
  { id:'casc-tree', short:'级联' },
  { id:'carousel', short:'轮播' },
  { id:'switches', short:'控件' },
  { id:'tabs', short:'Tabs' },
  { id:'tags', short:'标签' },
  { id:'image', short:'媒体' },
  { id:'card', short:'卡片' },
  { id:'steps', short:'流程' },
  { id:'tooltip', short:'提示' },
  { id:'buttons', short:'按钮' },
  { id:'icons', short:'图标' },
  { id:'layers', short:'浮层' },
  { id:'logs', short:'日志' }
];
function scrollTo(id:string){
  // 小程序 / H5 简易滚动
  const el = document?.getElementById?.(id);
  if(el) el.scrollIntoView({ behavior:'smooth', block:'start' });
}

/* Form */
const form = ref({ username:'', password:'', gender:'', hobbies:[] as string[], notify:false, intro:'', agree:false });
const rules = {
  username:[{ required:true, message:'请输入用户名', trigger:['blur','change'] },{ min:3, message:'至少 3 个字符', trigger:'blur' }],
  password:[{ required:true, message:'请输入密码', trigger:'blur' },{ min:6, message:'至少 6 位密码', trigger:'blur'}],
  gender:{ required:true, message:'请选择性别', trigger:'change'},
  hobbies:{ required:true, message:'请选择兴趣', trigger:'change'},
  notify:{ validator:(v:boolean)=> v || '请开启通知(示例)', trigger:'change'},
  agree:{ validator:(v:boolean)=> v || '请勾选协议', trigger:'change'}
};
const formRef = ref();
const submitting = ref(false);
const showResult = ref(false);
async function handleSubmit(){
  submitting.value=true; showResult.value=false;
  try { await formRef.value.validate(); await new Promise(r=>setTimeout(r,400)); showResult.value = true; pushLog('表单提交成功'); }
  catch { pushLog('表单验证失败'); }
  submitting.value=false;
}
function handleReset(){
  formRef.value.resetFields();
  showResult.value=false;
  pushLog('表单已重置');
}
function onFormValidate(valid:boolean){ pushLog('validate => '+valid); }
function beforeNotifyChange(){ return new Promise<boolean>(r=> setTimeout(()=> r(true), 200)); }

/* Extra Inputs */
const extra = ref({ note:'', amount:'', long:'' });

/* Basic controls */
const confirmSwitch = ref(false);
function confirmToggle(){ return new Promise<boolean>(r=> setTimeout(()=> r(true), 180)); }
const stepVal = ref(3);
const sliderVal = ref(40);
const rateVal = ref(3.5);

/* Select + Date */
const selectSingle = ref('');
const selectMulti = ref<string[]>([]);
const selectOptions = [
  { value:'apple', label:'苹果' },
  { value:'banana', label:'香蕉' },
  { value:'orange', label:'橘子' },
  { value:'grape', label:'葡萄' },
  { value:'kiwi', label:'猕猴桃' }
];
const pickedDate = ref('');
const inlineDate = ref('');
const timeVal = ref('');
const rangeVal = ref<string[]>([]);
const dateTimeVal = ref('');

/* Cascader / Tree / VirtualList data */
const cascVal = ref<(string|number)[]>([]);
const cascOptions = [
  { label:'浙江', value:'zj', children:[
      { label:'杭州', value:'hz', children:[
          { label:'西湖区', value:'xh' }, { label:'上城区', value:'sc' }
        ]},
      { label:'宁波', value:'nb' }
    ]},
  { label:'江苏', value:'js', children:[
      { label:'苏州', value:'sz' },
      { label:'南京', value:'nj' }
    ]}
];
const treeChecked = ref<(string|number)[]>([]);
const treeData = [
  { label:'前端', value:'fe', expand:true, children:[
      { label:'Vue', value:'vue' },
      { label:'React', value:'react' }
    ]},
  { label:'后端', value:'be', children:[
      { label:'Node', value:'node' },
      { label:'Go', value:'go' }
    ]}
];
const bigList = Array.from({ length:200 }, (_,i)=> ({ id:i+1, text:'Item '+(i+1) }));

/* Segmented & Pagination */
const segVal = ref('list');
const segOptions = [
  { label:'列表', value:'list' },
  { label:'图表', value:'chart' },
  { label:'设置', value:'setting' }
];
const page = ref(1);

/* Tabs & Progress */
const activeTab = ref('base');
const progress1 = ref(25);
function incProgress(){ progress1.value = (progress1.value + 10) % 110; }

/* Carousel */
const carouselIdx = ref(0);
const carouselSlides = [
  { id:1, text:'Slide 1', bg:'linear-gradient(135deg,#6965db,#938ee0)' },
  { id:2, text:'Slide 2', bg:'linear-gradient(135deg,#42526e,#6b778c)' },
  { id:3, text:'Slide 3', bg:'linear-gradient(135deg,#7b75dd,#c1bfe9)' },
  { id:4, text:'Slide 4', bg:'linear-gradient(135deg,#554fcf,#413f8a)' },
];

/* Icon showcase */
const commonIcons = [
  'search','bell','heart','heart-fill','star','star-fill','chat','chat-dots',
  'geo','gear','wifi','battery','play','pause','stop','arrow-up','arrow-down',
  'arrow-left','arrow-right','upload','download','trash','pencil','clock','calendar',
  'envelope','camera','cloud','cart','bag','wallet','lock','unlock','eye','eye-slash','user','home','grid','check','plus'
];
const pickedIcon = ref('');

/* Skeleton / Upload */
const skeletonLoading = ref(true);
function toggleSkeleton(){
  skeletonLoading.value = true;
  setTimeout(()=> skeletonLoading.value = false, 1500);
}
setTimeout(()=> skeletonLoading.value = false, 1200);
const uploadFiles = ref<string[]>([]);

/* Popups & overlay & drawer */
const popupShow = ref(false);
const showModal = ref(false);
const sheetShow = ref(false);
const showOverlay = ref(false);
const drawerShow = ref(false);
const dropdownVal = ref('');
const sheetActions = ref([
  { name:'复制' },
  { name:'分享', sub:'朋友圈/好友' },
  { name:'删除', color:'var(--lk-color-primary-active)' }
]);
function onSheetSelect(e:any){ toast('选择: ' + e.action.name); }
function confirmModal(){ toast('Modal 确定'); showModal.value=false; }

/* Toast 单条 */
const toastShow = ref(false);
const toastMsg = ref('');
function toast(msg:string){
  toastMsg.value = msg;
  toastShow.value = true;
  setTimeout(()=> toastShow.value=false, 2000);
}
function showSuccessToast(){ toast('操作成功'); }

/* Steps / Timeline */
const stepsCurrent = ref(1);
const stepsData = [
  { title:'步骤 1', sub:'准备' },
  { title:'步骤 2', sub:'配置' },
  { title:'步骤 3', sub:'提交' },
  { title:'完成', sub:'Finish' }
];
function nextStep(){ if(stepsCurrent.value < stepsData.length-1) stepsCurrent.value++; }
function prevStep(){ if(stepsCurrent.value > 0) stepsCurrent.value--; }

/* Loading button */
const iconLoading = ref(false);
function triggerIconLoading(){
  if(iconLoading.value) return;
  iconLoading.value = true;
  setTimeout(()=> iconLoading.value=false, 1500);
}

/* Collapse */
const collapseVals = ref<any[]>(['a']);

/* Tabbar page */
const tabActive = ref('home');

/* Logs */
const eventLog = ref<string[]>([]);
function pushLog(msg:string){ eventLog.value.push(`${new Date().toLocaleTimeString()} - ${msg}`); }
function clearLog(){ eventLog.value = []; }
function log(m:string){ pushLog(m); }
function openAgreement(){ toast('查看协议'); }

const prettyForm = computed(()=> JSON.stringify(form.value, null, 2));

function resetAll(){
  handleReset();
  extra.value = { note:'', amount:'', long:'' };
  confirmSwitch.value=false;
  stepVal.value=3;
  sliderVal.value=40;
  rateVal.value=3.5;
  selectSingle.value='';
  selectMulti.value=[];
  pickedDate.value='';
  inlineDate.value='';
  timeVal.value='';
  rangeVal.value=[];
  dateTimeVal.value='';
  cascVal.value=[];
  treeChecked.value=[];
  segVal.value='list';
  page.value=1;
  progress1.value=25;
  pickedIcon.value='';
  popupShow.value=false;
  showModal.value=false;
  sheetShow.value=false;
  showOverlay.value=false;
  toastShow.value=false;
  drawerShow.value=false;
  dropdownVal.value='';
  uploadFiles.value=[];
  stepsCurrent.value=1;
  collapseVals.value=['a'];
  carouselIdx.value=0;
  tabActive.value='home';
  pushLog('全部状态已重置');
}

/* End script */
</script>

<style scoped lang="scss">
.demo-page {
  display:flex;
  flex-direction:column;
  gap:48rpx;
  background: var(--lk-color-bg-body);
  color: var(--lk-color-text);
  font-size: 28rpx;
  box-sizing: border-box;
}

/* Anchor bar */
.anchor-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  display:flex;
  flex-wrap:wrap;
  gap: 16rpx;
  padding: 20rpx 8rpx 8rpx;
  background: linear-gradient(180deg, var(--lk-color-bg-body) 65%, transparent);
}
.anchor-item {
  padding: 10rpx 24rpx;
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-primary);
  border-radius: var(--lk-radius-pill);
  font-size: 24rpx;
  line-height:1;
  &:active {
    background: var(--lk-color-primary);
    color: var(--lk-color-text-inverse);
  }
}

.form-actions { margin-top:8rpx; display:flex; flex-direction:column; gap:20rpx; }
.inline-hint { margin-left:24rpx; font-size:26rpx; color: var(--lk-color-text-secondary); }
.result-box {
  background: var(--lk-color-primary-bg-soft);
  border:2rpx solid var(--lk-color-border);
  padding:28rpx;
  border-radius: var(--lk-radius-md);
  .result-title { font-size:30rpx; font-weight:600; margin-bottom:12rpx; color: var(--lk-color-primary-active); }
  .json { font-family: ui-monospace,Menlo,Consolas,monospace; white-space: pre-wrap; word-break: break-all; font-size:24rpx; line-height:1.5;}
}

.row { display:flex; align-items:center; gap:20rpx; }
.wrap { flex-wrap:wrap; }
.input-demo { display:flex; flex-direction:column; gap:12rpx; min-width:300rpx; flex:1; &.full{ width:100%; } }
.tip { font-size:24rpx; color: var(--lk-color-text-secondary); }

.picker-box, .tree-box, .vl-box {
  display:flex; flex-direction:column; gap:12rpx;
  min-width: 300rpx;
  flex: 1;
  max-width: 520rpx;
}
.tree-box { min-width: 340rpx; }
.vl-box { min-width: 420rpx; }

.cluster { display:flex; flex-direction:column; gap:12rpx; padding:12rpx 8rpx; min-width:220rpx; &__title{ font-size:24rpx; color: var(--lk-color-text-secondary);} }
.stepper-inline { min-width:360rpx; }
.select-box { display:flex; flex-direction:column; gap:12rpx; min-width:340rpx; flex:1; }
.calendar-box { max-width: 520rpx; }
.pad { padding:8rpx 4rpx; display:flex; flex-direction:column; gap:24rpx; }
.pad.center { align-items:center; }
.mt-16 { margin-top:16rpx; }
.desc { font-size:24rpx; color: var(--lk-color-text-secondary); }
.note { font-size:26rpx; color: var(--lk-color-text-secondary); }
.small { font-size:22rpx; }
.tag-group > view { margin-bottom: 8rpx; }
.upload-wrapper { margin-top: 32rpx; }

.carousel-slide {
  width:100%; height:100%;
  display:flex; align-items:center; justify-content:center;
  color:#fff;
  font-size: 40rpx;
  font-weight:600;
  letter-spacing:2rpx;
}

.vl-row {
  width:100%;
  font-size:26rpx;
  color: var(--lk-color-text);
}

/* Icons */
.icon-grid { display:grid; grid-template-columns: repeat(auto-fill,minmax(128rpx,1fr)); gap:24rpx 16rpx; }
.icon-cell {
  display:flex; flex-direction:column; align-items:center;
  padding:18rpx 8rpx 24rpx;
  border:2rpx solid var(--lk-color-border-weak);
  border-radius: var(--lk-radius-md);
  background: var(--lk-color-bg-surface);
  font-size:22rpx;
  color: var(--lk-color-text-secondary);
  transition: background var(--lk-transition-fast), color var(--lk-transition-fast), border-color var(--lk-transition-fast), box-shadow var(--lk-transition-fast), transform var(--lk-transition-fast);
  &:active { background: var(--lk-color-primary-bg-soft); transform: translateY(2rpx); }
  &.is-picked { border-color: var(--lk-color-primary); color: var(--lk-color-primary-active); box-shadow: 0 0 0 4rpx var(--lk-color-primary-bg-soft); }
  .icon-name { margin-top:10rpx; line-height:1.1; text-align:center; }
}

.event-log { display:flex; flex-direction:column; gap:6rpx; font-size:24rpx; color: var(--lk-color-text-secondary); max-height:340rpx; overflow:hidden; }

.link { color: var(--lk-color-primary); text-decoration:underline; &:active { color: var(--lk-color-primary-active);} }

.theme-toggle {
  display:inline-flex; align-items:center;
  padding:12rpx 24rpx;
  background: var(--lk-color-primary-bg-soft);
  color: var(--lk-color-primary);
  border-radius: var(--lk-radius-pill);
  font-size:26rpx; line-height:1;
  user-select:none;
  transition: background var(--lk-transition-fast), color var(--lk-transition-fast);
  &:active { background: var(--lk-color-primary-hover); color: var(--lk-color-text-inverse); }
  .ml-8 { margin-left:8rpx; }
}

.spin { animation: spin 1s linear infinite; }
@keyframes spin { to { transform: rotate(360deg);} }
</style>