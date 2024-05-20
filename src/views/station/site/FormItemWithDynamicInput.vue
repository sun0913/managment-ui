<template>
  <div class="item-container">
    <el-checkbox :label="item.name" :value="item.name"></el-checkbox>
    <div v-if="Array.isArray(selectedNames) && selectedNames.includes(item.name)">
      <div v-for="(inputValue, index) in inputMapping[item.name]  || []" :key="index">
        <el-input
            v-model="inputMapping[item.name][index]"
            :placeholder="item.name + '的信息'"
            class="input-field"
        ></el-input>
        <el-button class="input-button" @click="addInput(item.name)">+</el-button>
        <el-button class="input-button" @click="removeInput(item.name, index)" v-if="index !== 0">-</el-button>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType, watch, ref } from 'vue';

interface Item {
  name: string;
  // 其他属性
}

interface InputMapping {
  [key: string]: string[];
}

const props = defineProps({
  item: {
    type: Object as PropType<Item>,
    required: true,
  },
  selectedNames: {
    type: Array as PropType<string[]>,
    default: () => [],
  },
  inputMapping: {
    type: Object as PropType<InputMapping>,
    required: true,
  },
  stationSiteInfoList: {
    type: Array as PropType<Array<{ deviceName: string; deviceSn: string }>>,
    default: () => [],
  },
  isEditMode: {
    type: Boolean,
    default: false,
  },
});
watch(() => props.stationSiteInfoList, (newList) => {
  newList.forEach((info) => {
    if (info.deviceName === props.item.name) {
      // 如果是编辑模式并且selectedNames中还没有这个deviceName，则添加它
      if (props.isEditMode && !props.selectedNames.includes(info.deviceName)) {
        props.selectedNames.push(info.deviceName);
      }

      if (!props.inputMapping[info.deviceName]) {
        props.inputMapping[info.deviceName] = [info.deviceSn];
      } else if (!props.inputMapping[info.deviceName].includes(info.deviceSn)) {
        props.inputMapping[info.deviceName].push(info.deviceSn);
      }
    }
  });
}, { immediate: true });

const addInput = (name: string | number) => {
  if (!props.inputMapping[name]) {
    props.inputMapping[name] = [''];
  } else {
    props.inputMapping[name].push('');
  }
};

const removeInput = (name: string | number, index: number) => {
  if (props.inputMapping[name]) {
    props.inputMapping[name].splice(index, 1);
  }
};
</script>
<style scoped>
.item-container {
display: flex;
align-items: center;
flex-wrap: wrap;
margin-right: 20px;
}

.item-container > div {
margin-right: 20px;
display: flex;
align-items: center;
}

.input-field {
width: 150px;  /* 设置输入框的固定宽度 */
height: 25px;  /* 设置输入框的固定高度 */
margin-left: 10px;
}

.input-button {
height: 25px;  /* 和输入框的高度匹配 */
line-height: 25px;
padding: 0 10px;  /* 调整内部间距 */
margin-left: 10px;
}
</style>
