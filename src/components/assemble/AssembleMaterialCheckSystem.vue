<template>
  <div class="AssembleMaterialCheckSystem">
    <h3>
      优博创数字化工厂——装配物料核对系统
    </h3>
    <div style="border: 1px solid black;margin:0 auto;width: 90%">
      <el-form ref="form" :rules="rules" :model="form" label-width="8%" size="small" label-position="left">
        <el-form-item label="员工工号" prop="worker_id">
          <el-input v-model="form.worker_id" style="width:100%">
            <template slot="prepend">JS</template>
          </el-input>
        </el-form-item>
        <el-form-item label="台位编号">
          <el-input v-model="form.station_id" ref="station_id" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="工单号">
          <el-input v-model="form.work_order_number" ref="work_order_number" style="width:69%"
                    @blur="getPnAndBomByWorkerOrderNumber"
                    @keyup.enter.native="getPnAndBomByWorkerOrderNumber"></el-input>
          <el-button style="background-color: #409eff; color: #fff;width:30%" @click="getPnAndBomByWorkerOrderNumber">
            工单匹配
          </el-button>
        </el-form-item>
        <el-form-item label="产品PN">
          <el-input v-model="form.pn" :disabled="true" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="BOM">
          <el-input v-model="form.bom" :disabled="true" style="width:100%"></el-input>
        </el-form-item>
        <el-form-item label="当前工序">
          <el-select v-model="form.process" @change="getMaterials" placeholder="请选择当前工序" style="width:100%">
            <el-option
              v-for="item in process_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="核对物料" style="border: 1px solid black;margin:0 auto;width: 90%">
          <div v-for="(item, index) in form.materials" :key="index" style="margin: 20px">
            <el-tag>{{ form.materials[index].materialName }}</el-tag>
            <el-input v-model="form.materials[index].materialCode" style="width:50%"></el-input>
          </div>
        </el-form-item>
        <el-form-item label="核对结果">
          <el-tag :type="getCheckResultType(form.check_result)">{{ check_result_zh }}</el-tag>
        </el-form-item>
        <el-form-item>
          <el-row>
            <el-col :span="8">
              <el-button type="warning" @click="check_material">核对</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="info" @click="clear_form">重置</el-button>
            </el-col>
            <el-col :span="8">
              <el-button type="primary" @click="entry_result">录入结果</el-button>
            </el-col>
          </el-row>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'AssembleMaterialCheckSystem',
  components: {},
  mounted () {
  },
  methods: {
    getPnAndBomByWorkerOrderNumber () {

    },
    getMaterials () {
      if (this.form.process === 'test1') {
        this.form.materials = [
          {
            materialName: 'test1测试物料名称1',
            materialCode: ''
          },
          {
            materialName: 'test1测试物料名称2',
            materialCode: ''
          }
        ]
      } else if (this.form.process === 'test2') {
        this.form.materials = [
          {
            materialName: 'test2测试物料名称1',
            materialCode: ''
          },
          {
            materialName: 'test2测试物料名称2',
            materialCode: ''
          },
          {
            materialName: 'test2测试物料名称3',
            materialCode: ''
          }
        ]
      } else {
        this.form.materials = []
      }
    },
    check_material () {
      if (this.form.materials[0].materialCode !== 'test1') {
        this.$message({
          message: '物料代码不匹配，请核对',
          type: 'error'
        })
        this.form.check_result = false
        this.check_result_zh = '不匹配'
      } else {
        this.$message({
          message: '物料代码匹配',
          type: 'success'
        })
        this.form.check_result = true
        this.check_result_zh = '匹配'
      }
    },
    getCheckResultType (result) {
      if (result === false) {
        return 'danger'
      }
      if (result === true) {
        return 'success'
      }
      if (result === null) {
        return 'info'
      }
    },
    clear_form () {
      this.form = {
        worker_id: '',
        station_id: '',
        work_order_number: '',
        pn: '',
        bom: '',
        process: '',
        materials: [],
        check_result: null
      }
      this.check_result_zh = '无'
    }
  },
  data () {
    return {
      form: {
        worker_id: '',
        station_id: '',
        work_order_number: '',
        pn: '',
        bom: '',
        process: '',
        materials: [],
        check_result: null
      },
      rules: {
        worker_id: [
          {required: true, message: '请输入工号(数字)', trigger: 'blur'},
          {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'},
          {
            validator: function (rule, value, callback) {
              if (/^[0-9]{2,50}$/.test(value) === false) {
                callback(new Error('请输入工号(数字)'))
              } else {
                // 校验通过
                callback()
              }
            },
            trigger: 'blur'
          }
        ]
      },
      process_options: [
        {
          value: 'test1',
          label: 'test1'
        },
        {
          value: 'test2',
          label: 'test2'
        }
      ],
      check_result_zh: '无'
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
body {
  text-align: center
}
</style>
