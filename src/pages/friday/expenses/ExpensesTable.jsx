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

import { connect } from 'dva';

const namespace = 'expensesMSG';

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
  expensesTime: '',
  expensesSort: '',
};

let groupSelect = [];
let groupName = [];
let data = [];
// 选择分类
function changeType(value) {
  // console.log(value.key); // { key: "lucy", label: "Lucy (101)" }
  param.expensesSort = value.key;
}

// 选择时间段
function onChangeTime(date, dateString) {
  // console.log(dateString.toString());
  param.expensesTime = dateString.toString();
}





@connect(({ expensesMSG, loading }) => ({
  data: expensesMSG.data, // 将data赋值给
  loading: loading
}))

class EditableTableExpenses extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      editingKey: '',
      deleteKey:'',
      data: data,
      pagination: {},
      loading: false,
      visible: false,
    };
    this.columns = [
      {
        title: '消费id',
        dataIndex: 'expensesId',
        align: 'center',
        editable: false,
      },
      {
        title: '消费时间',
        dataIndex: 'expensesTime',
        align: 'center',
        editable: true,
      },
      {
        title: '消费金额',
        dataIndex: 'expensesNum',
        align: 'center',
        editable: true,
      },
      {
        title: '消费类型',
        dataIndex: 'expensesSort',
        align: 'center',
        editable: true,
      },
      {
        title: '备注',
        dataIndex: 'expensesRemark',
        align: 'center',
        editable: true,
      },
      {
        title: '消费人账号',
        dataIndex: 'expensesUserId',
        align: 'center',
        editable: true,
      },
      {
        title: '消费人姓名',
        dataIndex: 'expensesUser',
        editable: true,
      },

      {
        title: '操作',
        dataIndex: 'operation',
        align: 'center',
        render: (text, record) => {
          const { editingKey } = this.state;
          const editable = this.isEditing(record);
          return editable ? (
            <span>
              <EditableContext.Consumer>
                {form => (
                  <a onClick={() => this.save(form, record)} style={{ marginRight: 8 }}>
                    保存
                  </a>
                )}
              </EditableContext.Consumer>
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.expensesId)}>
                <a>取消</a>
              </Popconfirm>
            </span>
          ) : (
            <div>
              <Button
                type="primary"
                shape="round"
                icon="edit"
                size={'default'}
                style={{margin:'0 3px 0 3px'}}
                onClick={() => this.edit(record.expensesId)}
              >
                编辑
              </Button>
              <Popconfirm title="确定删除?" onConfirm={() => this.delete(record.expensesId)}>
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
        width: '20%',
      },
    ];
  }
  // 初始化表格数据
  componentDidMount() {
    this.fetch();

    this.props.dispatch({
      type: `${namespace}/findType`,
      callback: (data)=>{
          console.log(data);
        groupSelect = [];
        groupName = data;
        for (let i = 0; i < groupName.length; i++) {
          groupSelect.push(<Select.Option value={groupName[i]} key={i}>{groupName[i]}</Select.Option>)
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
      expensesSort:param.expensesSort,
      expensesTime:param.expensesTime,
      ...filters,
    });
  };

  // 发送请求
  fetch = (params = {}) => {
    // console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:10010/friday/bills/userExpenses/selectAll',
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

  // 搜索
  searchFund(expensesSort, expensesTime) {
    param.expensesSort = expensesSort;
    param.expensesTime = expensesTime;
    this.fetch(param);
  }

  isEditing = record => record.expensesId === this.state.editingKey;

  cancel = () => {
    this.setState({ editingKey: '' });
  };

  save(form, record) {
    // console.log(form);
    // console.log(key);
    form.validateFields((error, row) => {
      if (error) {
        return;
      }
      row["expensesId"] = record["expensesId"];
      const { dispatch } = this.props;
      dispatch({
        type: `${namespace}/updateExpenses`,
        payload: {
          ...row
        },
      });
      data = this.state.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].expensesId === row["expensesId"]) {
          data[i] = row;
          break;
        }
      }
      // console.log(data);
      this.setState({
        editingKey: '',
        data:data,});
      message.info('修改成功！');
    });
  }

  edit(key) {
    this.setState({ editingKey: key });
  }

  delete(key) {
    // console.log(key);
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/deleteExpenses`,
      payload: {
        id:key
      },
    });
    data = this.state.data;
    for (let i = 0; i <data.length; i++) {
      if (data[i].expensesId === key) {
        data.splice(i,1)
      }
    }
    message.info('删除成功！');
  }


  // 打开模态框
  showModal = () => {
    this.setState({
      visible: true,
    });

  };


  sub = (param) => {
    const { dispatch } = this.props;
    dispatch({
      type: `${namespace}/insertExpenses`,
      payload: {
        ...param
      },
    });
  };



  //增加模态框提交
  handleOk = e => {
    let isEmpty = true;
    // console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
      if (values["expensesUser"]!=null && values["expensesUser"] !== ""&&values["expensesSort"]!=null && values["expensesSort"] !== "" && values["expensesUser"]!=null && values["expensesUser"] !== ""){
        isEmpty = false;
      }
      if (!isEmpty){
        if(values["expensesSort"] === 999){
          values["expensesSort"] = values["expensesSort1"] == null || values["expensesSort1"] === "" ? "其他" : values["expensesSort1"]
        }
        this.sub(values);
        this.setState({
          visible: false,
        });

        setTimeout(() => this.fetch(param), 1000);
        message.info('添加成功！');
        this.props.form.resetFields();
      }
    });
  };

  // 关闭模态框
  handleCancel = e => {
    // console.log(e);
    this.setState({
      visible: false,
    });
  };


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
        onCell: record => ({
          record,
          inputType: col.dataIndex === 'age' ? 'number' : 'text',
          dataIndex: col.dataIndex,
          title: col.title,
          editing: this.isEditing(record),
        }),
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
                {groupSelect}
              </Select>
            </div>

            <div style={{ display: 'inline', whiteSpace: 'nowrap' }}>
              <label>查找时间：</label>
              <RangePicker
                onChange={onChangeTime}
                style={{
                  width: 180,
                  marginRight: '2.5rem',
                  marginBottom: '1rem',
                  whiteSpace: 'nowrap',
                }}
              />
            </div>
            <Button
              icon="search"
              type="primary"
              onClick={() => this.searchFund(param.expensesSort, param.expensesTime)}
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
                    onClick={()=>{location.href = 'http://localhost:10010/friday/bills/userExpenses/downloadExpenses?expensesTime='+param.expensesTime}}>
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
            rowKey="expensesId"
            rowClassName="editable-row"
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            loading={this.state.loading}
          />
        </EditableContext.Provider>

        <Modal
          title="添加支出"
          visible={this.state.visible}
          bodyStyle={{width:'auto',height:'300px'}}
          onOk={this.handleOk}
          afterClose={this.fetch}
          htmlType="submit"
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleOk} className="login-form">
            <Form.Item>
              {getFieldDecorator('expensesUser', {
                rules: [{ required: true, message: '消费人，默认为账号登录人' }],
              })(
                <Input
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="消费人"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
            {getFieldDecorator('expensesSort', {
                rules: [{ required: true, message: '请选择消费类型' }],
              })(
                <Select
                  placeholder="选择{其它}后可以自行填写"
                >
                  {groupSelect}
                  <Select.Option value={999} key={999}>其他</Select.Option>
                </Select>
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('expensesSort1', {
                rules: [{message: '请选择消费类型' }],
              })(
                <Input
                  placeholder="填写其他分类"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('expensesNum', {
                rules: [{ required: true, message: '请输入消费金额，单位：元' }],
              })(
                <Input
                  prefix={<Icon type="user" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  placeholder="消费金额"
                />,
              )}
            </Form.Item>
            <Form.Item>
              {getFieldDecorator('expensesRemark', {
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
    );
  }
}




const EditableCellForm = Form.create()(EditableTableExpenses);

export default class ExpensesTable extends React.Component {
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
