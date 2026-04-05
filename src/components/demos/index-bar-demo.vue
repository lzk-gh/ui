<script setup lang="ts">
import { computed, ref } from 'vue';

interface Contact {
  id: string;
  name: string;
  phone: string;
  avatar: string;
  color: string;
  pinyin: string;
}

// 联系人数据
const contacts: Contact[] = [
  { id: '1', name: '艾米', phone: '138****1234', avatar: '艾', color: '#FF6B6B', pinyin: 'A' },
  { id: '2', name: '安琪', phone: '139****5678', avatar: '安', color: '#4ECDC4', pinyin: 'A' },
  { id: '3', name: '白露', phone: '137****9012', avatar: '白', color: '#45B7D1', pinyin: 'B' },
  { id: '4', name: '陈思', phone: '136****3456', avatar: '陈', color: '#96CEB4', pinyin: 'C' },
  { id: '5', name: '程明', phone: '135****7890', avatar: '程', color: '#FFEAA7', pinyin: 'C' },
  { id: '6', name: '戴安', phone: '134****1234', avatar: '戴', color: '#DDA0DD', pinyin: 'D' },
  { id: '7', name: '杜鹃', phone: '133****5678', avatar: '杜', color: '#98D8C8', pinyin: 'D' },
  { id: '8', name: '范冰', phone: '132****9012', avatar: '范', color: '#F7DC6F', pinyin: 'F' },
  { id: '9', name: '高远', phone: '131****3456', avatar: '高', color: '#BB8FCE', pinyin: 'G' },
  { id: '10', name: '郭靖', phone: '130****7890', avatar: '郭', color: '#85C1E9', pinyin: 'G' },
  { id: '11', name: '韩雪', phone: '159****1234', avatar: '韩', color: '#F1948A', pinyin: 'H' },
  { id: '12', name: '黄蓉', phone: '158****5678', avatar: '黄', color: '#82E0AA', pinyin: 'H' },
  { id: '13', name: '贾宝', phone: '157****9012', avatar: '贾', color: '#F8C471', pinyin: 'J' },
  { id: '14', name: '金莲', phone: '156****3456', avatar: '金', color: '#AED6F1', pinyin: 'J' },
  { id: '15', name: '孔明', phone: '155****7890', avatar: '孔', color: '#D7BDE2', pinyin: 'K' },
  { id: '16', name: '李白', phone: '188****1234', avatar: '李', color: '#A3E4D7', pinyin: 'L' },
  { id: '17', name: '林黛', phone: '187****5678', avatar: '林', color: '#FAD7A0', pinyin: 'L' },
  { id: '18', name: '刘备', phone: '186****9012', avatar: '刘', color: '#F5B7B1', pinyin: 'L' },
  { id: '19', name: '马云', phone: '185****3456', avatar: '马', color: '#ABEBC6', pinyin: 'M' },
  { id: '20', name: '牛顿', phone: '184****7890', avatar: '牛', color: '#D2B4DE', pinyin: 'N' },
  { id: '21', name: '欧阳', phone: '183****1234', avatar: '欧', color: '#AED6F1', pinyin: 'O' },
  { id: '22', name: '潘金', phone: '182****5678', avatar: '潘', color: '#F9E79F', pinyin: 'P' },
  { id: '23', name: '秦始', phone: '181****9012', avatar: '秦', color: '#FADBD8', pinyin: 'Q' },
  { id: '24', name: '任盈', phone: '180****3456', avatar: '任', color: '#D5F5E3', pinyin: 'R' },
  { id: '25', name: '孙悟', phone: '199****7890', avatar: '孙', color: '#FDEDEC', pinyin: 'S' },
  { id: '26', name: '唐僧', phone: '198****1234', avatar: '唐', color: '#EBF5FB', pinyin: 'T' },
  { id: '27', name: '王熙', phone: '197****5678', avatar: '王', color: '#F4ECF7', pinyin: 'W' },
  { id: '28', name: '吴用', phone: '196****9012', avatar: '吴', color: '#E8F8F5', pinyin: 'W' },
  { id: '29', name: '夏雨', phone: '195****3456', avatar: '夏', color: '#FEF9E7', pinyin: 'X' },
  { id: '30', name: '杨过', phone: '194****7890', avatar: '杨', color: '#FBEEE6', pinyin: 'Y' },
  { id: '31', name: '张飞', phone: '193****1234', avatar: '张', color: '#F5EEF8', pinyin: 'Z' },
  { id: '32', name: '赵云', phone: '192****5678', avatar: '赵', color: '#EAF2F8', pinyin: 'Z' },
  { id: '33', name: '周瑜', phone: '191****9012', avatar: '周', color: '#E9F7EF', pinyin: 'Z' },
];

// 分组后的联系人
const contactGroups = computed(() => {
  const groups: { letter: string; contacts: Contact[] }[] = [];
  const map = new Map<string, Contact[]>();

  contacts.forEach(contact => {
    const letter = contact.pinyin;
    if (!map.has(letter)) {
      map.set(letter, []);
    }
    map.get(letter)!.push(contact);
  });

  // 排序
  const sortedKeys = Array.from(map.keys()).sort();
  sortedKeys.forEach(letter => {
    groups.push({ letter, contacts: map.get(letter)! });
  });

  return groups;
});

// 索引列表
const indexList = computed(() => contactGroups.value.map(g => g.letter));
const contentScrollTop = ref(0);
const contentScrollIntoView = ref('');

function onSelect(letter: string) {
  console.log('选择索引:', letter);
  contentScrollIntoView.value = `contact-group-${letter}`;
}

function onContentScroll(e: { detail: { scrollTop: number } }) {
  contentScrollTop.value = e.detail.scrollTop;
}

function onContactClick(contact: Contact) {
  uni.showToast({
    title: `${contact.name} - ${contact.phone}`,
    icon: 'none',
  });
}
</script>

<template>
  <view class="contacts-page">
    <!-- 搜索栏 -->
    <view class="search-bar">
      <view class="search-input">
        <text class="search-icon">🔍</text>
        <text class="search-placeholder">搜索联系人</text>
      </view>
    </view>

    <!-- 联系人列表 -->
    <scroll-view
      id="index-bar-content"
      class="contacts-content"
      scroll-y
      scroll-with-animation
      :scroll-into-view="contentScrollIntoView"
      @scroll="onContentScroll"
    >
      <lk-index-bar
        :index-list="indexList"
        :scroll-top="contentScrollTop"
        scroll-target="#index-bar-content"
        @select="onSelect"
      >
        <lk-index-anchor
          v-for="group in contactGroups"
          :id="`contact-group-${group.letter}`"
          :key="group.letter"
          :index="group.letter"
          :title="group.letter"
        >
          <view
            v-for="contact in group.contacts"
            :key="contact.id"
            class="contact-item"
            @click="onContactClick(contact)"
          >
            <view class="contact-avatar" :style="{ background: contact.color }">
              {{ contact.avatar }}
            </view>
            <view class="contact-info">
              <view class="contact-name">{{ contact.name }}</view>
              <view class="contact-desc">{{ contact.phone }}</view>
            </view>
            <view class="contact-actions">
              <view class="action-btn action-btn--call">📞</view>
              <view class="action-btn action-btn--msg">💬</view>
            </view>
          </view>
        </lk-index-anchor>
      </lk-index-bar>
    </scroll-view>
  </view>
</template>
<style scoped lang="scss">
.contacts-page {
  min-height: 100vh;
  background: var(--lk-color-bg-page);
  padding-bottom: 100rpx;
}

.search-bar {
  position: sticky;
  top: 0;
  z-index: 50;
  padding: 24rpx 32rpx;
  background: var(--lk-color-bg-container);
  border-bottom: 2rpx solid var(--lk-color-border-light);
}

.search-input {
  display: flex;
  align-items: center;
  gap: 16rpx;
  padding: 20rpx 28rpx;
  background: var(--lk-color-fill-quaternary);
  border-radius: 48rpx;
}

.search-icon {
  font-size: 32rpx;
  opacity: 0.5;
}

.search-placeholder {
  font-size: 28rpx;
  color: var(--lk-color-text-tertiary);
}

.contacts-content {
  height: 1200rpx;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 24rpx;
  padding: 24rpx 32rpx;
  background: var(--lk-color-bg-container);
  transition: background 0.2s ease;

  &:active {
    background: var(--lk-color-fill-quaternary);
  }
}

.contact-avatar {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 36rpx;
  font-weight: 600;
  color: #fff;
  flex-shrink: 0;
  box-shadow: 0 4rpx 12rpx rgba(0, 0, 0, 0.1);
}

.contact-info {
  flex: 1;
  min-width: 0;
}

.contact-name {
  font-size: 32rpx;
  font-weight: 500;
  color: var(--lk-color-text);
  margin-bottom: 8rpx;
}

.contact-desc {
  font-size: 26rpx;
  color: var(--lk-color-text-tertiary);
}

.contact-actions {
  display: flex;
  gap: 24rpx;
}

.action-btn {
  width: 72rpx;
  height: 72rpx;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28rpx;
  transition: all 0.2s ease;

  &:active {
    transform: scale(0.9);
  }

  &--call {
    background: linear-gradient(135deg, #4ecdc4 0%, #44a3aa 100%);
  }

  &--msg {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  }
}
</style>
