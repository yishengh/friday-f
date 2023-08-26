import React from 'react';
import { Select ,Row ,Col , Button, Tooltip, Table} from 'antd';
import reqwest from 'reqwest';

const columns = [
  {
    title: '股票代码',
    dataIndex: 'code',
    sorter: true,
  },
  {
    title: '股票名称',
    dataIndex: 'name',
    sorter: true,
  },
  {
    title: '当前价格',
    dataIndex: 'price',
    sorter: true,
  },{
    title: '涨幅',
    dataIndex: 'changePercent',
    sorter: true,
  },{
    title: '买入价格',
    dataIndex: 'buy',
    sorter: true,
    render: buy => `${buy[0]}`,
  },{
    title: '卖出价格',
    dataIndex: 'sell',
    sorter: true,
    render: sell => `${sell[0]}`,
  },{
    title: '最高价格',
    dataIndex: 'high',
    sorter: true,
  },{
    title: '最低价格',
    dataIndex: 'low',
    sorter: true,
  },
  {
    title: '成交量',
    dataIndex: 'volume',
    sorter: true,
  },{
    title: '成交额',
    dataIndex: 'turnover',
    sorter: true,
  },
];


let param = {
  sort : 'turnover',
  node : 'a'
};
const { Option } = Select;

function handleChange(value) {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
  param.sort = value.key
}

function changeType(value) {
  console.log(value); // { key: "lucy", label: "Lucy (101)" }
  param.node = value.key
}

export default class ExpensesIndex extends React.Component{
  constructor(props) {
    super(props);
    const params = new URLSearchParams(this.props.location.search);
    let industryCode = params.get("industryCode") != null ? params.get("industryCode") : "111111";
    this.state = {
      industryCode:industryCode,
      data: [],
      pagination: {},
      loading: false,
    };
  }

  componentDidMount() {
    this.fetch();
  }




  handleTableChange = (pagination, filters, sorter) => {
    const pager = { ...this.state.pagination };
    pager.current = pagination.current;
    this.setState({
      pagination: pager,
    });
    this.fetch({
      pageSize: pagination.pageSize,
      pageIndex: pagination.current,
      sort: sorter.field,
      ...filters,
    });
  };

  fetch = (params = {}) => {
    console.log('params:', param);
    this.setState({ loading: true });
    reqwest({
      url: 'https://api.doctorxiong.club/v1/stock/rank',
      method: 'post',
      contentType: 'application/json',
      headers:{
        'Content-Type':'application/json'
      },
      data: JSON.stringify(
        {
          pageSize: 10,
          pageIndex: 1,
          sort: param.sort,
          node: param.node,
          industryCode:this.state.industryCode == "111111" ? null : this.state.industryCode,
          ...params,
        }
      ),
      type: 'json',
    }).then(data => {
      const pagination = { ...this.state.pagination };
      pagination.total = data.data.allPages;
      this.setState({
        loading: false,
        data: data.data.rank,
        pagination,
      });
    });
  };


  click(record,rowkey){
    console.log(record.code);
    this.props.history.push({ pathname : '/stockMarket/StockMarketDetail' , query : { code : record.code }})
  }

  searchStock(sort, node) {
    param.sort = sort;
    param.node = node;
    this.fetch(param)
  }

  render() {
    return(
      <div>
        <Row style = {{fontSize:'14px'}}>
          <Col span={20}>
            <div style={{display : 'inline',whiteSpace:'nowrap'}}>
            <label>股票类型:</label>
            <Select
              labelInValue
              defaultValue={{ key: '沪深A股' }}
              style={{ width: 180 ,marginRight: '2.5rem', marginBottom :'1rem', whiteSpace:'nowrap' }}
              onChange={changeType}
            >
              <Option value="a">沪深A股</Option>
              <Option value="b">沪市A股</Option>
              <Option value="ash">深市A股</Option>
              <Option value="asz">沪深B股</Option>
              <Option value="bsh">沪市B股</Option>
              <Option value="bsz">深市B股</Option>
            </Select>
            </div>

            <div style={{display : 'inline',whiteSpace:'nowrap'}}>
              <label>排序方式:</label>
            <Select
              labelInValue
              defaultValue={{ key: '成交额' }}
              style={{ width: 180 ,marginRight: '2.5rem', marginBottom :'1rem', whiteSpace:'nowrap'}}
              onChange={handleChange}
            >
              <Option value="price">价格</Option>
              <Option value="changePercent">涨幅比例</Option>
              <Option value="buy">买入价格</Option>
              <Option value="sell">卖出价格</Option>
              <Option value="open">开盘价格</Option>
              <Option value="close">收盘价格</Option>
              <Option value="high">最高价</Option>
              <Option value="low">最低价</Option>
              <Option value="volume">成交量</Option>
              <Option value="turnover">成交额</Option>
            </Select>
            </div>

            <div style={{display : 'inline',whiteSpace:'nowrap'}}>
            </div>
            <Button icon="search" type="primary" onClick={() => this.searchStock(param.sort, param.node)}>Search</Button>
          </Col>

          <Col span = {4}>
          </Col>
        </Row>

        <Table
          columns={columns}
          rowKey="code"
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
      </div>
    )
  }


}
