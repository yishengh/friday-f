import React from 'react';
import { PageHeader, Button, Descriptions,Statistic, Card,Popover,Tag} from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';

//引入echarts主模块
import * as echarts from 'echarts'// 引入柱状图
import 'echarts/lib/chart/bar';
// 引入标题和提示框
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';

import { connect } from 'dva';

const namespace = 'expensesMSG';

let myChart,myRChart;

@connect(({ expensesMSG: expensesMSG, loading }) => ({
  data: expensesMSG.data, // 将data赋值给
  loading: loading
}))
export default class ExpensesIndex extends React.Component{
  constructor(props) {
    super(props);
    this.state={
      expensesTotal: "",
      expensesGroup: [],
      expensesList:[],
      todayExpenses: "",
      flag: "month",
      visible: false,
      groupName: [],
      groupSum: [],
      timeList: [],
      timeSum: [],
      listName: "本月支出曲线图",
      groupSort: "本月支出饼状图",
      top1: "今日支出",
      top2: "本月支出",
      top3: "较大支出分类",
      top4:"查看本年",
      top3Data:"学习",
      percent:0,
    };
  }

  componentDidMount=()=>{
    this.getMonthCount("month");

  };


  hide = () => {
    this.setState({
      visible: false,
    });
  };

  showGraphic = ()=>{
    // 图表初始化
    myChart=echarts.init(document.getElementById("spendingCurve"));
    myRChart = echarts.init(document.getElementById("spendingGroup"));

    myChart.setOption({
      title: {
        text: this.state.listName,
        left: 'center'
      },
      xAxis: {
        type: 'category',
        data: this.state.timeList
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: this.state.timeSum,
        type: 'line',
        smooth: true
      }]
    });

    myRChart.setOption({
      title: {
        text: this.state.groupSort,
        left: 'center'
      },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b} : {c} ({d}%)'
      },
      legend: {
        orient: 'vertical',
        left: 'left',
        data: this.state.groupName
      },
      series: [
        {
          name: this.state.groupSort,
          type: 'pie',
          radius: '55%',
          center: ['50%', '60%'],
          data: this.state.expensesGroup,
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowOffsetX: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        }
      ]

    })
  };

  handleVisibleChange = visible => {
    this.setState({ visible });
  };

  changeYOrM = () =>{
    if (this.state.flag === "month") {
      this.setState({
        flag: "year",
        listName: "本年支出曲线图",
        groupSort: "本年支出饼状图",
        top1: "今日支出",
        top2: "本年支出",
        top3: "较大支出分类",
        top4:"查看本月",
      });
      this.getMonthCount("year");
    }else {
      this.setState({
        flag: "month",
        listName: "本月支出曲线图",
        groupSort: "本月支出饼状图",
        top1: "今日支出",
        top2: "本月支出",
        top3: "较大支出分类",
        top4:"查看本年",
      });
      this.getMonthCount("month");
    }
  };


  getMonthCount = (flag) =>{
    this.props.dispatch({
      type: `${namespace}/getExpensesCollection`,
      payload: {
        flag: flag
      },
      callback: (data) =>{
        let timeList = [], timeSum = [], top3Data = "",percent = 0;
        for (let i = 0; i < data.expensesList.length; i++) {
          timeList[i] = data.expensesList[i].expensesTime;
          timeSum[i] = parseFloat(data.expensesList[i].num);
        }
        let avg = parseFloat(data.expensesTotal)/(timeList.length);
        console.log("平均" + avg);
        console.log("今日" + data.todayExpenses);
        if (avg === 0 || avg ==null){
          percent = 0;
        } else {
          percent = (parseFloat(data.todayExpenses) - avg) / avg;
        }
        if(data.expensesGroup != null && data.expensesGroup.length > 0){
          for (let i = 0; i < 3; i++) {
            top3Data += data.expensesGroup[i].name + "、"
          }
        }
        this.setState({
          timeList:timeList,
          timeSum:timeSum,
          expensesTotal:data.expensesTotal,
          todayExpenses:data.todayExpenses,
          expensesGroup:data.expensesGroup,
          top3Data: top3Data,
          percent: percent * 100
        });
        this.showGraphic();
      }
    })
  }



  render() {
    return(
      <div
        style={{
          backgroundColor: '#F5F5F5',
          padding: 0,
        }}
      >
        <PageHeader
          ghost={false}
          title="您好！ Ezer_Wu"
          subTitle="下面是您的支出情况"
          extra={<Popover
            content={
              <span>
                <Tag color="red">{"再次点击切换"}</Tag>
              </span>

            }
            title="提示"
            trigger="click"
            visible={this.state.visible}
            onVisibleChange={this.handleVisibleChange}
          >
            <Button type="primary"
                    onClick={this.changeYOrM}
            >{this.state.top4}</Button>
          </Popover>}
        >
          <Descriptions size="small" column={3}>
            <Card>
              <Descriptions.Item label="上升率">
                <Statistic
                  value={this.state.percent}
                  precision={2}
                  valueStyle={{ color: '#3f8600' }}
                  prefix={<ArrowUpOutlined />}
                  suffix="%"
                />
              </Descriptions.Item>
            </Card>
            <Descriptions.Item label={this.state.top1}><a>{this.state.todayExpenses}</a></Descriptions.Item>
            <Descriptions.Item label={this.state.top2}>
              <a>{this.state.expensesTotal}</a>
            </Descriptions.Item>
            <Descriptions.Item label="统计时间">{new Date().toLocaleDateString()}</Descriptions.Item>
            <Descriptions.Item label={this.state.top3}>
              <a>{this.state.top3Data}</a>
            </Descriptions.Item>
          </Descriptions>
        </PageHeader>
        <div style={{width:'100%'}}>
          <div id="spendingCurve" style={{width:'45%',height : '30rem',marginTop : '1rem',float : 'left',minWidth:'300px'}}></div>
          <div id="spendingGroup" style={{width:'45%',height : '30rem',marginTop : '1rem', float : 'right',minWidth:'300px'}}></div>
        </div>

      </div>

    )
  }
}
