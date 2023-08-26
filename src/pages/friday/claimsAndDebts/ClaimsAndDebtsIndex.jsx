import React from 'react';
import {Tabs,Descriptions,Divider,Row,Col  } from 'antd'
import * as echarts from 'echarts'// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import { connect } from 'dva';

let chartOne,chartTwo;

const namespace = 'claimsAndDebtsMSG';
@connect(({ incomeMSG: incomeMSG, loading }) => ({
  data: incomeMSG.data, // 将data赋值给
  loading: loading
}))
export default class ClaimsAndDebtsIndex extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      cadId:'',
      cadType:'',
      creditor:'',
      obligor:'',
      cadNum:'',
      cadTime:'',
      cadRepay:'',
      cadPlan:'',
      cadRemark:'',
      cadStatus:'',
      claimsGroup:[],
      debtGroup:[],
      sumClaim:'',
      sumDebt:'',
      maxClaim:'',
      maxDebt:''
    }
  }

  componentDidMount(){
    this.props.dispatch({
      type: `${namespace}/getClaimsAndDebtsCollection`,
      callback: (data)=>{
        if (data){
          let cadStatus = this.state.sumClaim - this.state.sumDebt >0 ? '良好':'较差';
          this.setState({
            claimsGroup:data.claimsGroup,
            debtGroup:data.debtGroup,
            sumClaim:data.sumClaim,
            sumDebt:data.sumDebt,
            maxClaim:data.maxClaim,
            maxDebt:data.maxDebt,
            cadStatus:cadStatus
          });
          this.showGraph();
        }
      }
    })

  }

  showGraph = () =>{
    chartOne = echarts.init(document.getElementById("debt"));
    chartTwo = echarts.init(document.getElementById("claims"));
    chartOne.setOption({
      legend: {
        top: 'bottom'
      },
      title:{
        text: '今年债务占比图',
        left: 'center'
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [30, 120],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          label: {
            show: 'false'
          },
          emphasis: {
            label: {
              show: 'true'
            }
          },
          data: this.state.claimsGroup
        }
      ]
    });
    chartTwo.setOption({
      legend: {
        top: 'bottom'
      },
      title:{
        text: '今年债权占比图',
        left: 'center'
      },
      series: [
        {
          name: '面积模式',
          type: 'pie',
          radius: [30, 120],
          center: ['50%', '50%'],
          roseType: 'area',
          itemStyle: {
            borderRadius: 5
          },
          label: {
            show: 'false'
          },
          emphasis: {
            label: {
              show: 'true'
            }
          },
          data: this.state.debtGroup
        }
      ]
    });
  }

  render() {
    return(
      <div style={{background:'#ffffff',padding:'5%'}}>
        <div>
          <div id="debt" style={{width:'50%',height : '22rem',marginTop : '1rem',float : 'left',minWidth:'260px'}}></div>
          <div id="claims" style={{width:'50%',height : '22rem',marginTop : '1rem', float : 'left',minWidth:'260px'}}></div>
        </div>
        <Divider plain>Text</Divider>
        <Descriptions title="债务总状况" style={{marginTop:'1.5rem'}}>
          <Descriptions.Item label="债务总额">{this.state.sumDebt}</Descriptions.Item>
          <Descriptions.Item label="债权总额">{this.state.sumClaim}</Descriptions.Item>
          <Descriptions.Item label="债务债权差额">{this.state.sumClaim - this.state.sumDebt}</Descriptions.Item>
          <Descriptions.Item label="最高债务额">{this.state.maxDebt}</Descriptions.Item>
          <Descriptions.Item label="最高债权额">{this.state.maxClaim}</Descriptions.Item>
          <Descriptions.Item label="当前财务状况">{this.state.cadStatus}</Descriptions.Item>
        </Descriptions>

      </div>
    )
  }
}
