<template>
  <button @click="fetchResults" />
</template>

<script>
  import  '@/mock/mock.js';
  import {ajaxMethod} from  'common/ajaxJs';
  export default {
    data () {
      return {
        testName: '',
        flag:false
      }
    },
    methods: {
      fetchResults(){
        this.flag = true;
        ajaxMethod('http://123.com',null,'post',function(data){
          this.testName = data;
        })
      },
      /*increment () {
        this.count++
      },
      incrementByAsync () {
        window.setTimeout(() => {
          this.count++;
        }, 1000)
      }*/
    }
  }
</script>
