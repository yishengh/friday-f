import React from 'react';
import {
  Descriptions,
  Select,
  Row,
  Col,
  Button,
  Modal,
  Table,
  DatePicker,
  InputNumber,
  Input,
  Form,
  Popconfirm,
  message,
  Checkbox,
  Icon} from 'antd'
//引入echarts主模块
import * as echarts from 'echarts'// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import reqwest from 'reqwest';

import { connect , routerRedux} from 'dva';
const { Option } = Select;
const { RangePicker } = DatePicker;

const namespace = 'assetsMSG';


let chartA ,chartB,chartC,groupSelectList = [], groupNameList = [],data = [];
// 初始化值
let param = {
  assetsTime: '',
  assetsSort: '',
};

// 选择分类
function changeType(value) {
  console.log(value.key); // { key: "lucy", label: "Lucy (101)" }
  param.assetsSort = value.key;
}

const EditableContext = React.createContext();


@connect(({ assetsMSG: assetsMSG, loading }) => ({
  data: assetsMSG.data, // 将data赋值给
  loading: loading
}))
class AssetsIndexHead extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      editingKey: '',
      deleteKey:'',
      data: data,
      pagination: {},
      loading: false,
      visible: false,
      assetsId:'',
      assetRatio:[],
      loanSituation:[],
      totalCost:'',
      totalRealizableValue:'',
      totalMortgage:'',
      monthCost:''
    }

    this.columns = [
      {
        title: '资产id主键',
        dataIndex: 'assetsId',
        align: 'center',
      },
      {
        title: '资产名',
        dataIndex: 'assetsName',
        align: 'center',
        width:'10%'
      },
      {
        title: '资产所在地',
        dataIndex: 'assetsLocation',
        align: 'center',
      },
      {
        title: '资产获得时间',
        dataIndex: 'assetsCreateTime',
        align: 'center',
        width:'10%'
      },
      {
        title: '全款或首付花费',
        dataIndex: 'totalPrice',
        align: 'center',
        width:'12%'
      },
      {
        title: '历史价值',
        dataIndex: 'historicalValue',
        align: 'center',
        width:'10%'

      },
      {
        title: '资产所有者',
        dataIndex: 'assetsOwner',
        align: 'center',
        width:'10%'
      },
      {
        title: '资产分期',
        dataIndex: 'assetsInstalment',
        align: 'center',
        width:'10%'
      },
      {
        title: '每期价格',
        dataIndex: 'instalmentPrice',
        align: 'center',
        width:'8%'
      },
      {
        title: '剩余期限',
        dataIndex: 'instalmentSurplus',
        align: 'center',
        width:'8%'
      },
      {
        title: '变现价值',
        dataIndex: 'realizationValue',
        align: 'center',
        width:'8%'
      },
      {
        title: '备注',
        dataIndex: 'assetsRemark',
        align: 'center',
        width:'8%'
      },


      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
          return  (
            <div>
              <Popconfirm title="确定删除?" onConfirm={() => this.delete(record.assetsId)}>
                <Button
                  type="danger"
                  shape="round"
                  icon="delete"
                  size={'default'}
                  style={{margin:'0 3px 0 3px'}}
                >
                  删除
                </Button>
              </Popconfirm>
            </div>
          );
        },
        width: '10%',
      },
    ];
  }


  // 变换条件发送请求
  handleTableChange = (pagination, filters) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      limit: pagination.pageSize,
      offset: pagination.current,
      ...filters,
    });
  };

  // 发送请求
  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:10010/friday/equity/userAssets/selectAll',
      method: 'get',
      contentType: 'application/json',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        limit: 10,
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // Read total count from server
      pagination.total = data.count;
      this.setState({
        loading: false,
        data: data.data,
        pagination,
      });
    });
  };

  // 跳转事件
  click(record,rowkey){

    console.log(record.assetsCode);
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
        pathname : '/assets/AssetsTable' , query : { code : record.assetsId}
      })
    )
  }


  // 搜索
  searchAssets(assetsSort, assetsTime) {
    param.assetsSort = assetsSort;
    param.assetsTime = assetsTime;
    this.fetch(param);
  }

  delete(key) {
    console.log(key);
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteAssets`,
      payload: {
        id:key
      },
    });
    data = this.state.data;
    for (let i = 0; i <data.length; i++) {
      if (data[i].assetsId === key) {
        data.splice(i,1)
      }
    }
    message.info('删除成功！');
  }

  componentDidMount = ()=>{
    this.fetch();

    // 分类
    this.props.dispatch({
      type: `${namespace}/findAssetsTypeName`,
      callback: (data)=>{
        if (data){
          this.setState({
            assetRatio:data.assetRatio,
            loanSituation: data.loanSituation,
            totalCost:data.totalCost,
            totalRealizableValue:data.totalRealizableValue,
            totalMortgage:data.totalMortgage,
            monthCost:data.monthCost
          });
          this.showGraph();
        }
      }
    })

  }
  showGraph = () =>{
    chartA = echarts.init(document.getElementById("fixed"));
    chartB = echarts.init(document.getElementById("balance"));
    chartC = echarts.init(document.getElementById("intangible"));
    chartA.setOption({
      title: {
        text: '资产占比情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          name: '当前金额',
          type: 'pie',
          radius: ['40%', '70%'],
          avoidLabelOverlap: false,
          itemStyle: {
            borderRadius: 10,
            borderColor: '#fff',
            borderWidth: 2
          },
          label: {
            show: false,
            position: 'center'
          },
          emphasis: {
            label: {
              show: true,
              fontSize: '40',
              fontWeight: 'bold'
            }
          },
          labelLine: {
            show: false
          },
          data: this.state.assetRatio
        }
      ]
    });
    chartB.setOption({
      title: {
        text: '资产贷款率',
        left: 'center'
      },
      series: [{
        name: 'Pressure',
        type: 'gauge',
        progress: {
          show: true
        },
        detail: {
          valueAnimation: true,
          formatter: '{value}'
        },
        data: [{
          value: (parseInt((this.state.totalMortgage/this.state.totalCost)*100)),
          name: '比值%'
        }]
      }]
    });
    chartC.setOption({
      title: {
        text: '资产按揭情况',
        left: 'center'
      },
      tooltip: {
        trigger: 'item'
      },
      series: [
        {
          type: 'pie',
          radius: '50%',
          data: this.state.loanSituation
        }
      ]
    });
  };


  // 打开模态框
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  sub = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/insertAssets`,
      payload: {
        ...param
      },
    });
  };



  //增加模态框提交
  handleOk = e => {
    console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
      this.sub(values);
      this.setState({
        visible: false,
      });
      message.info('添加成功！');
      setTimeout(() => this.fetch(param), 1000);
      this.props.form.resetFields();
    });
  };

  // 关闭模态框
  handleCancel = e => {
    console.log(e);
    this.setState({
      visible: false,
    });
  };

  render() {
    const { getFieldDecorator } = this.props.form;

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
      };
    });

    return(
      <div>
        <div style={{width:'100%',background:'#ffffff'}}>
          <div id="fixed" style={{width:'33%',height : '18rem',marginTop : '1rem',float : 'left',minWidth:'300px'}}></div>
          <div id="balance" style={{width:'34%',height : '18rem',marginTop : '1rem', float : 'left',minWidth:'300px'}}></div>
          <div id="intangible" style={{width:'33%',height : '18rem',marginTop : '1rem', float : 'right',minWidth:'300px'}}></div>
        </div>
        <Descriptions title="资产情况" style={{background:'#ffffff',padding:'5%'}}>
          <Descriptions.Item label="资产总成本">{this.state.totalCost}</Descriptions.Item>
          <Descriptions.Item label="资产变现总值">{this.state.totalRealizableValue}</Descriptions.Item>
          <Descriptions.Item label="当前变现盈亏情况">{this.state.totalRealizableValue - this.state.totalCost}</Descriptions.Item>
          <Descriptions.Item label="按揭剩余总额">{this.state.totalMortgage}</Descriptions.Item>
          <Descriptions.Item label="每月应付按揭费用">{this.state.monthCost}</Descriptions.Item>
        </Descriptions>

        <div style={{background:'#ffffff',padding:'0 5%'}}>
          <Row style={{ fontSize: '14px' }}>
            <Col span={20}>
              <Button
                icon="search"
                type="primary"
                onClick={() => this.searchAssets(param.assetsSort, param.assetsTime)}
              >
                Search
              </Button>
            </Col>

            <Col span={4}></Col>
          </Row>
          <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
            <Col span={24}>
              <Button type="primary" icon="add" style={{ marginLeft: '0.3rem', float: 'right' }} onClick={this.showModal}>
                添加
              </Button>
              <Button type="primary" icon="download" style={{ marginLeft: '0.3rem', float: 'right' }}
                      onClick={()=>{location.href = 'http://localhost:10010/friday/bills/userAssets/downloadAssets?assetsTime='+param.assetsTime}}
              >
                导出
              </Button>
            </Col>
          </Row>
          <EditableContext.Provider value={this.props.form}>
            <Table
              bordered
              dataSource={this.state.data}
              columns={columns}
              rowKey="assetsId"
              rowClassName="editable-row"
              onChange={this.handleTableChange}
              pagination={this.state.pagination}
              loading={this.state.loading}
              onRow={(record,rowkey)=>{
                return{
                  onClick : this.click.bind(this,record,rowkey)    //点击行 record 指的本行的数据内容，rowkey指的是本行的索引
                }
              }}
            />
          </EditableContext.Provider>
        </div>

        <Modal
          title="添加资产"
          visible={this.state.visible}
          bodyStyle={{width:'auto',height:'500px'}}
          onOk={this.handleOk}
          afterClose={this.fetch}
          htmlType="submit"
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleOk} className="login-form">
            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('assetsOwner', {
                rules: [{ required: true, message: '所有人，默认账号登录人' }],
              })(
                <Input
                  placeholder="所有人"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('assetsName', {
                rules: [{message: '请填写资产名' }],
              })(
                <Input
                  placeholder="资产名"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('assetsLocation', {
                rules: [{message: '请填写所在地' }],
              })(
                <Input
                  placeholder="所在地"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('assetsCreateTime', {
                rules: [{message: '请填写获得时间' }],
              })(
                <Input
                  placeholder="获得时间"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('totalPrice', {
                rules: [{message: '请填写全款或首付花费' }],
              })(
                <Input
                  placeholder="全款或首付花费"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('historicalValue', {
                rules: [{message: '请填写历史价值' }],
              })(
                <Input
                  placeholder="历史价值"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('assetsInstalment', {
                rules: [{ message: '财产分期' }],
              })(
                <Input
                  placeholder="财产分期"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('instalmentPrice', {
                rules: [{message: '每期价格' }],
              })(
                <Input
                  placeholder="每期价格"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('instalmentSurplus', {
                rules: [{message: '剩余期限' }],
              })(
                <Input
                  placeholder="剩余期限"
                />,
              )}
            </Form.Item>


            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('realizationValue', {
                rules: [{message: '变现价值' }],
              })(
                <Input
                  placeholder="变现价值"
                />,
              )}
            </Form.Item>


            <Form.Item>
              {getFieldDecorator('assetsRemark', {
                rules: [{  message: '备注' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="备注（非必填）"
                />,
              )}
            </Form.Item>
          </Form>
        </Modal>
      </div>
    )
  }
}

const AssetsIndexHeader = Form.create()(AssetsIndexHead);

export default class AssetsIndex extends React.Component {
  render(){

    return(
      <div>
        <AssetsIndexHeader/>
      </div>
    )
  }
}

