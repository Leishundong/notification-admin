import Vue from 'vue'
import user from '@/components/user/index'
import provide from '../../../src/apollo/index'
/*import mocks from '@/mock/mock.js';*/

import { mount, createLocalVue, shallowMount } from '@vue/test-utils'
/*
describe('user.vue', () => {
  it('获取mixin值', () => {
    const Constructor = Vue.extend(user);
    const userComponent = new Constructor().$mount();
    expect(userComponent.toBe).to.equal(false);
    expect(userComponent.partialPiginator.totalElements).to.equal(10);
  })
})
*/

describe('取值测试',()=>{
  const localVue = createLocalVue()
  localVue.use(provide)
  const wrapper = shallowMount(user, {
    localVue,
    provide
  })
  const vm = wrapper.vm;
  it('获取mixin值', () => {
    expect(vm.param.namelike).to.equal('%%');
    expect(vm.param.paginator.page).to.equal(1);
    expect(vm.paginator.page).to.equal(1);
  })
})
describe('查询测试', ()=>{
  const localVue = createLocalVue();
  const wrapper = mount(user, {
    localVue,
    provide
  })
  const vm = wrapper.vm;
  it('1.namelike绑定是否正常？', () => {
    vm.param.namelike = 1;
    expect(vm.param.namelike).to.equal(1);
  });
  it('2.computed是否生效？', () => {
    vm.param.paginator.size = 7;
    expect(vm.paginator.size).to.equal(7);
    vm.param.paginator.size = 5;
    expect(vm.paginator.size).to.equal(5);
  });
  console.log(wrapper.vm.$apollo);
  it('3.开始mock请求返回值', ()=>{
    expect(vm.testName).to.equal('1');
  })
})
