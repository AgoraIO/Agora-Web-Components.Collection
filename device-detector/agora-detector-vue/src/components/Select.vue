<template>
  <div :class="$style['select']">
    <div :class="$style['select-container']"
      ref="select" @click.stop="handleClickSelect">
      <div :class="$style['select-text']">{{currentLabel}}</div>
      <div :class="{ [$style['select-arrow']]: true, [$style['arrow-reverse']]: showDropdown }">
        <div :class="$style['select-arrow-inner']"></div>
      </div>
      <div :class="$style['select-dropdown']"
        ref="selectDropdown" v-show="showDropdown">
        <div :class="$style['select-dropdown__item']"
          v-for="item in items"
          :key="item.value"
          @click.stop="handleClickSelectItem(item)">
          <span :class="$style['select-text']">{{item.label}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import {
  Component, Vue, Prop,
} from 'vue-property-decorator';
import { SelectItem } from '../types/types';

@Component
export default class Select extends Vue {
  @Prop() private items!: { label: string | number; value: any }[];

  @Prop() readonly currentItem!: SelectItem;

  private showDropdown = false;

  get currentLabel() {
    if (!this.currentItem) return 'None';
    return this.currentItem.label;
  }

  private handleClickSelectItem(value: any) {
    this.$emit('change', value);
    this.showDropdown = !this.showDropdown;
  }

  private handleClickSelect() {
    this.showDropdown = !this.showDropdown;
  }

  private documentClickListener(e: MouseEvent) {
    if (!(e as any).path.includes(this.$refs.selectDropdown)) {
      this.showDropdown = false;
    }
  }

  private mounted() {
    document.addEventListener('click', this.documentClickListener);
  }

  private beforeDestroy() {
    document.removeEventListener('click', this.documentClickListener);
  }
}
</script>

<style module>
  .select {
    position: relative;
    box-sizing: border-box;
    width:90%;
    height:36px;
    background:rgba(255,255,255,1);
    border-radius:4px;
    border:1px solid rgba(159,170,184,1);
    line-height:36px;
    user-select: none;

    font-size:16px;
    font-weight:400;
    color:rgba(92,103,116,1);
  }
  .select-text {
    margin-left: 10px;
    max-width: 480px;
    overflow: hidden;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .select-arrow {
    display: inline-flex;
    position: absolute;
    align-items: center;
    justify-content: center;
    width: 26px;
    height: 26px;
    right: 7px;
    top: 5px;
  }
  .select-arrow-inner {
    width: 0;
    height: 0;
    border-top: 7px solid #9FAAB8;
    border-right: 7px solid transparent;
    border-bottom: 7px solid transparent;
    border-left: 7px solid transparent;
    transform: translateY(3.5px);
  }
  .arrow-reverse .select-arrow-inner {
    transform: rotateX(180deg) translateY(3.5px);
  }

  .select-dropdown {
    position: absolute;
    left: 0;
    top: 36px;
    background:rgba(255,255,255,1);
    border:1px solid rgba(159,170,184,1);
    width:98%;
    transition: opacity 2s ease;
    border-radius:4px;
    overflow: hidden;
  }
  .select-dropdown__item {
    width: 100%;
    height:36px;
    background: inherit;
    line-height:36px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  .select-dropdown__item:hover {
    background-color: #f5f7fa;
    cursor:pointer;
  }
</style>
