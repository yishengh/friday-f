import React from 'react';
import {Descriptions, Badge } from 'antd';
import { connect , routerRedux} from 'dva';
import reqwest from 'reqwest';



const namespace = 'assetsMSG';

@connect(({ assetsMSG: assetsMSG, loading }) => ({
  data: assetsMSG.data, // 将data赋值给
  loading: loading
}))
export default class AssetsTable extends React.Component{
  constructor(props){
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    let code = params.get("code") != null ? params.get("code") : "1";

    this.state = {
      code : code,
      assetsId:'',
      assetsName:'',
      assetsLocation:'',
      assetsCreateTime:'',
      totalPrice:'',
      historicalValue:'',
      assetsOwner:'',
      assetsInstalment:'',
      instalmentPrice:'',
      instalmentSurplus:'',
      realizationValue:'',
      assetsRemark:'',

      allPrices:'',
      lastMonth:'',
      profitAndLoss:'',
      profitAndLossPer:'',
      incomePer:''
    }
  }

  componentDidMount(){
    console.log(this.state.code);
    this.props.dispatch({
      type: `${namespace}/getAssetsCollection`,
      payload:{
        id: this.state.code
      },
      callback: (data)=>{
        if (data){
          this.setState({
            assetsId:data.assetsId,
            assetsName:data.assetsName,
            assetsLocation:data.assetsLocation,
            assetsCreateTime:data.assetsCreateTime,
            totalPrice:data.totalPrice,
            historicalValue:data.historicalValue,
            assetsOwner:data.assetsOwner,
            assetsInstalment:data.assetsInstalment,
            instalmentPrice:data.instalmentPrice,
            instalmentSurplus:data.instalmentSurplus,
            realizationValue:data.realizationValue,
            assetsRemark:data.assetsRemark,
          });
        }
      }
    })

  }
  render() {
    return(
     <div style={{background:'#ffffff',padding:'5%'}}>
       <Descriptions title={this.state.assetsName} layout="vertical" bordered>
         <Descriptions.Item label="资产id">{this.state.assetsId}</Descriptions.Item>
         <Descriptions.Item label="资产名">{this.state.assetsName}</Descriptions.Item>
         <Descriptions.Item label="所在地">{this.state.assetsLocation}</Descriptions.Item>
         <Descriptions.Item label="获得时间">{this.state.assetsCreateTime}</Descriptions.Item>
         <Descriptions.Item label="初期花费">{this.state.totalPrice}</Descriptions.Item>
         <Descriptions.Item label="历史价值">{this.state.historicalValue}</Descriptions.Item>
         <Descriptions.Item label="变现价值">{this.state.realizationValue}</Descriptions.Item>
         <Descriptions.Item label="状态">
           <Badge status="processing" text="使用中" />
         </Descriptions.Item>
         <Descriptions.Item label="所有者">{this.state.assetsOwner}</Descriptions.Item>
         <Descriptions.Item label="资产分期">{this.state.assetsInstalment}</Descriptions.Item>
         <Descriptions.Item label="每期价格">{this.state.instalmentPrice}</Descriptions.Item>
         <Descriptions.Item label="剩余期限（年）">{parseInt(this.state.instalmentSurplus/12)}</Descriptions.Item>
         <Descriptions.Item label="资产总价">{parseInt((this.state.instalmentPrice*this.state.assetsInstalment+this.state.totalPrice)*100)}%</Descriptions.Item>
         <Descriptions.Item label="剩余期数（月）">{this.state.instalmentSurplus}</Descriptions.Item>
         <Descriptions.Item label="变现盈亏">{this.state.realizationValue-this.state.historicalValue}</Descriptions.Item>
         <Descriptions.Item label="盈亏率">{parseInt(((this.state.realizationValue-this.state.historicalValue)/this.state.historicalValue)*100)}%</Descriptions.Item>
         <Descriptions.Item label=""></Descriptions.Item>
         <Descriptions.Item label=""></Descriptions.Item>
         <Descriptions.Item label="备注"  span={3}>
           {this.state.assetsRemark}
         </Descriptions.Item>
       </Descriptions>
     </div>
    )
  }
}
