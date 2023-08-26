import React from 'react';
import {Table} from 'antd'
import reqwest from 'reqwest';

const columns = [
  {
    title: '行业代码',
    dataIndex: 'industryCode',
    sorter: true,
  },
  {
    title: '行业名称',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: '平均价格',
    dataIndex: 'averagePrice',
    sorter: true,
  },
  {
    title: '涨幅',
    dataIndex: 'changePercent',
    sorter: true,
  },
  {
    title: '成交量',
    dataIndex: 'volume',
    sorter: true,
  },
  {
    title: '成交额',
    dataIndex: 'turnover',
    sorter: true,
  }
];

export default class ExpensesIndex extends React.Component{

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      pagination: {},
      loading: false,
    };
  }

  click(record,rowkey){

    console.log(record.industryCode);
    this.props.history.push({ pathname : '/stockMarket/StockMarketRank' , query : { industryCode : record.industryCode }})
  }



  componentDidMount() {
    this.fetch();
  }

  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    // pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      // pageSize: pagination.pageSize,
      // page: pagination.current,
      sortField: sorter.field,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'https://api.doctorxiong.club/v1/stock/industry/rank',
      method: 'get',
      data: {
        // pageSize: 10,
        // sort:"r",
        ...params,
      },
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      // pagination.total = data.allPages;
      this.setState({
        loading: false,
        data: data.data,
      });
    });
  };

  render() {
    return (
      <Table
        columns={columns}
        rowKey="industryCode"
        dataSource={this.state.data}
        pagination={this.state.pagination}
        loading={this.state.loading}
        onChange={this.handleTableChange}
        onRow={(record,rowkey)=>{
          return{
            onClick : this.click.bind(this,record,rowkey)    //点击行 record 指的本行的数据内容，rowkey指的是本行的索引
          }
        }}
      />
    );
  }
}
