/*
import Vue from 'vue'
import HelloWorld from '@/components/HelloWorld'
import { mount ,shallowMount} from '@vue/test-utils'
describe('摩卡：HelloWorld.vue', () => {
  const vmComponent = new Vue(HelloWorld).$mount();
  it('计数器在点击按钮时自增', () => {
    // 调用实例中的increment方法，点击计数器
    vmComponent.increment();
    // 判断最后的count是否为最后对应的值
    expect(vmComponent.count).to.equal(1);
  })
  it('count异步更新, count的值应该为1', (done) => {
    vmComponent.incrementByAsync()
    //1s后进行断言
    window.setTimeout(() => {
      // 断言:count的值应该是数字1
      expect(vmComponent.count).to.equal(2);
      done();
    }, 1000);
  });
});
describe('vue/test-utils：HelloWorld.vue',()=>{
  // 现在挂载组件，你便得到了这个包裹器
  const wrapper = mount(HelloWorld)

  it('渲染正确的标记', () => {
    expect(wrapper.html()).to.contain('<span class="count">0</span>')
  })

  // 检查已存在的元素
  it('是一个按钮', () => {
    expect(wrapper.contains('button')).to.equal(true)
  })
  //直接判断值
  it('点击按钮应该使得计数递增', () => {
    expect(wrapper.vm.count).to.equal(0)
    wrapper.find('button').trigger('click')
    expect(wrapper.vm.count).to.equal(1)
  });
  //判断渲染值
  it('点击按钮应该渲染count', () => {
    /!*expect(wrapper.vm.count).to.equal(0)
    wrapper.find('button').trigger('click')*!/
    expect(wrapper.find('div').text()).contains('1')
  })
  it('异步：点击按钮应该使得计数递增', (done) => {
    Vue.config.errorHandler = done
    Vue.nextTick(() => {
      const button = wrapper.find('button')
      wrapper.find('button').trigger('click')
      expect(wrapper.vm.count).to.equal(2)
      done()
    })
  })
})
*/
import { shallowMount,createLocalVue} from '@vue/test-utils'
import HelloWorld from '@/components/HelloWorld'
import mocks from '@/mock/mock.js';


it('fetch', () => {
  const localVue = createLocalVue()
  localVue.use(mocks);
  const wrapper = shallowMount(HelloWorld, {
    localVue,
    mocks
  })
  wrapper.find('button').trigger('click');
  wrapper.vm.$nextTick(() => {
    expect(wrapper.vm.testName).to.equal('2')
    done()
  })
})
