import React from 'react';
import {
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
  Icon
} from 'antd';
import reqwest from 'reqwest';

import { connect , routerRedux} from 'dva';


const namespace = 'fundMSG';

const { Option } = Select;
const { RangePicker } = DatePicker;

const EditableContext = React.createContext();

class EditableCell extends React.Component {
  getInput = () => {
    if (this.props.inputType === 'number') {
      return <InputNumber />;
    }
    return <Input />;
  };

  renderCell = ({ getFieldDecorator }) => {
    const {
      editing,
      dataIndex,
      title,
      inputType,
      record,
      index,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editing ? (
          <Form.Item style={{ margin: 0 }}>
            {getFieldDecorator(dataIndex, {
              rules: [
                {
                  required: true,
                  message: `Please Input ${title}!`,
                },
              ],
              initialValue: record[dataIndex],
            })(this.getInput())}
          </Form.Item>
        ) : (
          children
        )}
      </td>
    );
  };

  render() {
    return <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>;
  }
}

// 初始化值
let param = {
  fundTime: '',
  fundSort: '',
};

let groupSelectList = [];
let groupNameList = [];
let data = [];
// 选择分类
function changeType(value) {
  console.log(value.key); // { key: "lucy", label: "Lucy (101)" }
  param.fundSort = value.key;
}


@connect(({ fundMSG: fundMSG, loading }) => ({
  data: fundMSG.data, // 将data赋值给
  loading: loading
}))

class EditableTableFund extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      deleteKey:'',
      data: data,
      pagination: {},
      loading: false,
      visible: false
    };
    this.columns = [
      {
        title: '序号',
        dataIndex: 'fundId',
        align: 'center',
      },
      {
        title: '基金代码',
        dataIndex: 'fundCode',
        align: 'center',
        width:'10%'
      },
      {
        title: '基金名称',
        dataIndex: 'fundName',
        align: 'center',
      },
      {
        title: '基金类型',
        dataIndex: 'fundType',
        align: 'center',
        width:'10%'
      },
      {
        title: '当前基金单位净值',
        dataIndex: 'netWorth',
        align: 'center',
        width:'12%'
      },
      {
        title: '原始买入费率(%)',
        dataIndex: 'buySourceRate',
        align: 'center',
        width:'10%'

      },
      {
        title: '当前买入费率(%)',
        dataIndex: 'buyRate',
        align: 'center',
        width:'10%'
      },
      {
        title: '基金经理',
        dataIndex: 'manager',
        align: 'center',
        width:'10%'
      },
      {
        title: '每万分收益(货币基金)',
        dataIndex: 'millionCopiesIncome',
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
              <Popconfirm title="确定删除?" onConfirm={() => this.delete(record.fundId)}>
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
  // 初始化表格数据
  componentDidMount() {
    this.fetch();

    //分类
    this.props.dispatch({
      type: `${namespace}/findFundTypeName`,
      callback: (data)=>{
        console.log(data);
        groupSelectList = [];
        groupNameList = data;
        for (let i = 0; i < groupNameList.length; i++) {
          groupSelectList.push(<Select.Option value={groupNameList[i]} key={i}>{groupNameList[i]}</Select.Option>)
        }
      }
    })

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
      url: 'http://localhost:10010/friday/finance/userFund/selectAll',
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

    console.log(record.fundCode);
    const {dispatch} = this.props;
    dispatch(routerRedux.push({
      pathname : '/fund/FundDetail' , query : { code : record.fundCode}
      })
    )
  }


  // 搜索
  searchFund(fundSort, fundTime) {
    param.fundSort = fundSort;
    param.fundTime = fundTime;
    this.fetch(param);
  }

  delete(key) {
    console.log(key);
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteFund`,
      payload: {
        id:key
      },
    });
    data = this.state.data;
    for (let i = 0; i <data.length; i++) {
      if (data[i].fundId === key) {
        data.splice(i,1)
      }
    }
    message.info('删除成功！');
  }


  render() {
    const { getFieldDecorator } = this.props.form;

    const components = {
      body: {
        cell: EditableCell,
      },
    };

    const columns = this.columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
      };
    });


    return (
      <div>
        <Row style={{ fontSize: '14px' }}>
          <Col span={20}>
            <div style={{ display: 'inline', whiteSpace: 'nowrap' }}>
              <label>支出类型:</label>
              <Select
                // mode="multiple"
                placeholder={'可选类型，默认全选'}
                labelInValue
                style={{
                  width: 180,
                  marginRight: '2.5rem',
                  marginBottom: '1rem',
                  whiteSpace: 'nowrap',
                }}
                onChange={changeType}
              >
                <Option value="">全部</Option>
                {groupSelectList}
              </Select>
            </div>

            <Button
              icon="search"
              type="primary"
              onClick={() => this.searchFund(param.fundSort, param.fundTime)}
            >
              Search
            </Button>
          </Col>

          <Col span={4}></Col>
        </Row>
        <Row style={{ marginTop: '1rem', marginBottom: '1rem' }}>
          <Col span={24}>
            <Button type="primary" icon="download" style={{ marginLeft: '0.3rem', float: 'right' }}
                    onClick={()=>{location.href = 'http://localhost:10010/friday/bills/userFund/downloadFund?fundTime='+param.fundTime}}
            >
              下载
            </Button>
          </Col>
        </Row>
        <EditableContext.Provider value={this.props.form}>
          <Table
            components={components}
            bordered
            dataSource={this.state.data}
            columns={columns}
            rowKey="fundId"
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
    );
  }
}




const EditableCellForm = Form.create()(EditableTableFund);

export default class FundTable extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <EditableCellForm />
      </div>
    );
  }
}
