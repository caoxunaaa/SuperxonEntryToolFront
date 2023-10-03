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
          <el-select v-model="form.process" placeholder="请选择当前工序" style="width:100%">
            <el-option
              v-for="item in process_options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="tco" prop="tco">
          <el-switch v-model="form.tco" style="width:5%;float: left" @change="use_tco"></el-switch>
        </el-form-item>
        <el-form-item label="核对物料" style="border: 1px dashed black;margin:0 auto;width: 90%">
          <el-button type="primary" @click="add_material">添加核对物料项</el-button>
          <el-button type="danger" @click="sub_material">减少核对物料项</el-button>
          <div v-for="(item, index) in form.materials" :key="index" style="margin: 20px">
            <el-tag>{{index+1}}</el-tag>
            <el-input v-model="form.materials[index]['material_code']" style="width:50%"></el-input>
            <el-button v-if="form.materials[index]['result']" type="success" icon="el-icon-check"></el-button>
            <el-button v-else  type="danger" icon="el-icon-close"></el-button>
          </div>
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
              <el-button type="primary" @click="entry_result('form')">录入结果</el-button>
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
      let that = this
      that.$axios({
        url: '/osa_entry/entry/pn-and-bom-by-worker-order',
        method: 'get',
        params: {
          workOrder: that.form.work_order_number
        }
      }).then(function (response) {
        console.log(response.data)
        that.form.bom = response.data['Bom']
        that.form.pn = response.data['Pn']
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '没有找到对应工单号信息！'
        })
      })
    },
    check_material () {
      let that = this
      that.$axios({
        url: '/osa_entry/check/material_code_of_assemble_by_bom',
        method: 'get',
        params: {
          bom: that.form.bom
        }
      }).then(function (response) {
        console.log(response.data)
        for (let j = 0; j < that.form.materials.length; j++) {
          that.form.materials[j]['result'] = false
          for (let i = 0; i < response.data.length; i++) {
            if (response.data[i]['material_code'] === that.form.materials[j]['material_code']) {
              that.form.materials[j]['result'] = true
              break
            }
          }
        }
        console.log(that.form.materials)
      }).catch(function () {
        that.$message({
          type: 'error',
          message: '没有找到对应BOM信息！'
        })
      })
    },
    add_material () {
      this.form.materials.push({'material_code': '', 'result': false})
      this.check_material()
    },
    sub_material () {
      this.form.materials.pop()
      this.check_material()
    },
    clear_form () {
      this.form = {
        worker_id: '',
        station_id: '',
        work_order_number: '',
        pn: '',
        bom: '',
        process: '',
        tco: false,
        materials: []
      }
    },
    use_tco () {
      let that = this
      if (that.form.tco) {
        that.$prompt('请输入密码', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(({ value }) => {
          if (value !== '123456') {
            that.$message({
              type: 'error',
              message: '密码不正确'
            })
            that.form.tco = false
          }
        }).catch(() => {
          that.form.tco = false
        })
      }
    },
    entry_result (form) {
      let that = this
      that.$refs[form].validate((valid) => {
        if (!valid) {
          that.$message({
            type: 'error',
            message: '数据校验不通过'
          })
          return
        }
        if (!that.form.tco) {
          for (let i = 0; i < that.form.materials.length; i++) {
            if (!that.form.materials[i]['result']) {
              that.$message({
                type: 'danger',
                message: '核对存在错误的结果，请重新核对'
              })
              return
            }
          }
        }
        let mlNumber = ''
        let tcoInfo = ''
        for (let i = 0; i < that.form.materials.length; i++) {
          if (that.form.materials[i]['result']) {
            mlNumber += that.form.materials[i]['material_code'] + ';'
          } else {
            tcoInfo += that.form.materials[i]['material_code'] + ';'
          }
        }
        that.$axios({
          url: '/osa_entry/entry/entry_assemble_info',
          method: 'post',
          data: {
            id: Date.now(),
            pn: that.form.pn,
            bom: that.form.bom,
            batch: that.form.work_order_number,
            operator: that.form.worker_id,
            station_id: that.form.station_id,
            log_action: that.form.process,
            action_time: Date.now(),
            ml_number: mlNumber,
            tco_info: tcoInfo
          }
        }).then(function () {
          that.$message({
            type: 'success',
            message: '插入数据成功！'
          })
        }).catch(function () {
          that.$message({
            type: 'error',
            message: '没有找到对应BOM信息！'
          })
        })
      })
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
        tco: false,
        materials: []
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
          value: '散热器组装',
          label: '散热器组装'
        },
        {
          value: '贴胶',
          label: '贴胶'
        },
        {
          value: '绝缘环',
          label: '绝缘环'
        },
        {
          value: '装下壳体',
          label: '装下壳体'
        },
        {
          value: '装上壳体',
          label: '装上壳体'
        },
        {
          value: '螺丝固定',
          label: '螺丝固定'
        },
        {
          value: '弹片组装',
          label: '弹片组装'
        },
        {
          value: '解锁件组装',
          label: '解锁件组装'
        }
      ]
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
