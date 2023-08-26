import React from 'react';
import {Tabs, Input, Row, Col, Card , message,
} from 'antd';
//引入echarts主模块
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import Button from "antd/es/button";

import reqwest from "reqwest";
const { TabPane } = Tabs;
const { Search } = Input;
import ReactEcharts from 'echarts-for-react';
import { connect } from 'dva';

const namespace = 'fundMSG';

const gridStyle = {
  width: '100%',
  textAlign: 'center',
  marginBottom: '0rem'
};

function splitData(rawData) {
  var timeList = [];
  var unitNetWorth = [];
  const dailyIncrease = [];
  for (var i = 0; i < rawData.length; i++) {
    for (var j = 0; j < 3; j++) {
      timeList.push(rawData[i][0]);
      unitNetWorth.push(parseFloat(rawData[i][1]));
      dailyIncrease.push(parseFloat(rawData[i][2]));
    }
  }
  return {
    timeList:  timeList,
    unitNetWorth: unitNetWorth,
    dailyIncrease: dailyIncrease
  };
}

@connect(({ fundMSG: fundMSG, loading }) => ({
  data: fundMSG.data, // 将data赋值给
  loading: loading
}))
export default class FundDetail extends React.Component{
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    let code = params.get("code") != null ? params.get("code") : "000961";

    this.state = { // 初始化this.state
      code : code,
      netWorthData:{
        //时间线
        timeList : [],
        //单位净值
        unitNetWorth : [],
        // 日涨幅
        dailyIncrease : [],
      },
      data : {

      }
    };
  }


  componentDidMount=()=>{
      this.fetch();
  };


  fetch = (params = {}) => {
    reqwest({
      url: 'https://api.doctorxiong.club/v1/fund/detail',
      method: 'get',
      contentType: 'application/json',
      headers:{
        'Content-Type':'application/json'
      },
      data: {
        code: this.state.code,
        startDate:'2020-01-01'
      },
      type: 'json',
    }).then(data => {
      this.setState({
        data: data.data,
        netWorthData: splitData(data.data.netWorthData)
      });
    });
  };

  jump = () =>{
    let data = this.state.data;
    data.fundCode = data.code;
    data.netWorthData = this.state.netWorthData;
    data.fundName = data.name;
    data.fundType = data.type;
    console.log(data);

    this.props.dispatch({
      type: `${namespace}/insertFund`,
      payload: {
        ...data
      },
      callback: (data)=>{
        console.log(data);
        message.info("添加成功！");
      }
    })
    // this.props.history.push({
    //   pathname : '/fund/MyFundTable' ,
    //   query : {
    //     code: data.code ,
    //     visit: true,
    //     type: data.type,
    //     netWorth: data.netWorth,
    //     dayGrowth: data.dayGrowth
    //   }})
    /*
    * data.type
    * data.netWorth
    * data.dayGrowth
    * */
  };

  render() {
    const date = this.state.netWorthData.timeList;
    const unit = this.state.netWorthData.unitNetWorth;
    const daily = this.state.netWorthData.dailyIncrease;
    const option = {
    title: {
      text: '基金详情曲线图'
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['单位净值与日涨幅趋势']
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: date
    },
    yAxis: {
      type: 'value'
    },
    series: [
      {
        name: '单位净值',
        type: 'line',
        stack: '总量',
        data: unit
      },
      {
        name: '日涨幅',
        type: 'line',
        stack: '总量',
        data: daily
      }
    ]
  };
    const data = this.state.data;

    return(
      <div>
        <Search
          placeholder="请输入基金代码"
          enterButton="Search"
          size="large"
          onSearch={value => {
            this.setState({
              code : value ? value : null
            });
            this.fetch();
          }}
        />

        <Row style={{margin:'1.2rem'}}>
          <Col span={24}>
            <Card title={data.name} hoverable={true} style={{width:'20%',float:'left',minWidth:'260px',marginLeft:'1rem'}}>
              <Card.Grid style={gridStyle}>{"类型：" + data.type}</Card.Grid>
              <Card.Grid style={gridStyle}>{"单位净值："+data.netWorth}</Card.Grid>
              <Card.Grid style={gridStyle}>{"日涨跌幅："+ data.dayGrowth + "%"}</Card.Grid>
              <Card.Grid style={gridStyle}>{"净值估算：" + data.expectWorth}</Card.Grid>
              <Card.Grid style={gridStyle}>{"近一个月" + data.lastMonthGrowth + "%"}</Card.Grid>
              <Card.Grid style={gridStyle}>{"近三个月" + data.lastThreeMonthsGrowth + "%"}</Card.Grid>
              <Card.Grid style={gridStyle}>{"近六个月" + data.lastSixMonthsGrowth + "%"}</Card.Grid>
              <Card.Grid style={gridStyle}>{"近一年" + data.lastYearGrowth + "%"}</Card.Grid>
              <Card.Grid style={gridStyle}><Button onClick={this.jump} size={"small"} >已购买该方案</Button></Card.Grid>
            </Card>

            <Tabs defaultActiveKey="1" style={{textAlign:'center',width:'70%',float:'right',minWidth:'300px',marginTop:'1rem'}} >
              <TabPane tab="今日分时数据" key="1" forceRender={true}>
              <ReactEcharts option={option} style={{width:'100%',height:'30rem'}}/>
              </TabPane>
            </Tabs>
          </Col>
        </Row>
      </div>
    )
  }
}
