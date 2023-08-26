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

const namespace = 'claimsAndDebtsMSG';

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
  cadTime: '',
  cadType: '',
};

let data = [];
// 选择分类
function changeType(value) {
  // console.log(value.key); // { key: "lucy", label: "Lucy (101)" }
  param.cadType = value.key;
}

// 选择时间段
function onChangeTime(date, dateString) {
  // console.log(dateString.toString());
  param.cadTime = dateString.toString();
}





@connect(({ claimsAndDebtsMSG, loading }) => ({
  data: claimsAndDebtsMSG.data, // 将data赋值给
  loading: loading
}))

class EditableTableClaimsAndDebts extends React.Component {
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
        title: '资产负债ID',
        dataIndex: 'cadId',
        align: 'center',
        editable: false,
      },
      {
        title: '借入|借出',
        dataIndex: 'cadType',
        align: 'center',
        editable: true,
      },
      {
        title: '债权人',
        dataIndex: 'creditor',
        align: 'center',
        editable: true,
      },
      {
        title: '债务人',
        dataIndex: 'obligor',
        align: 'center',
        editable: true,
      },
      {
        title: '交易数量',
        dataIndex: 'cadNum',
        align: 'center',
        editable: true,
      },
      {
        title: '交易时间',
        dataIndex: 'cadTime',
        align: 'center',
        editable: true,
      },
      {
        title: '已偿还金额',
        dataIndex: 'cadRepay',
        editable: true,
      },

      {
        title: '预计偿还时间',
        dataIndex: 'cadPlan',
        editable: true,
      },

      {
        title: '备注',
        dataIndex: 'cadRemark',
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
              <Popconfirm title="Sure to cancel?" onConfirm={() => this.cancel(record.cadId)}>
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
                onClick={() => this.edit(record.cadId)}
              >
                编辑
              </Button>
              <Popconfirm title="确定删除?" onConfirm={() => this.delete(record.cadId)}>
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

    // this.props.dispatch({
    //   type: `${namespace}/findType`,
    //   callback: (data)=>{
    //     console.log(data);
    //     groupSelect = [];
    //     groupName = data;
    //     for (let i = 0; i < groupName.length; i++) {
    //       groupSelect.push(<Select.Option value={groupName[i]} key={i}>{groupName[i]}</Select.Option>)
    //     }
    //   }
    // })
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
      cadType: param.cadType,
      cadTime: param.cadTime,
      ...filters,
    });
  };

  // 发送请求
  fetch = (params = {}) => {
    // console.log('params:', params);
    this.setState({ loading: true });
    reqwest({
      url: 'http://localhost:10010/friday/equity/claimsAndDebt/selectAll',
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
  searchFund(cadType, cadTime) {
    param.cadType = cadType;
    param.cadTime = cadTime;
    this.fetch(param);
  }

  isEditing = record => record.cadId === this.state.editingKey;

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
      row["cadId"] = record["cadId"];
      const { dispatch } = this.props;
      dispatch({
        type: `${namespace}/updateClaimsAndDebts`,
        payload: {
          ...row
        },
      });
      data = this.state.data;
      for (let i = 0; i < data.length; i++) {
        if (data[i].cadId === row["cadId"]) {
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
      type: `${namespace}/deleteClaimsAndDebts`,
      payload: {
        id:key
      },
    });
    data = this.state.data;
    for (let i = 0; i <data.length; i++) {
      if (data[i].cadId === key) {
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
      type: `${namespace}/insertClaimsAndDebts`,
      payload: {
        ...param
      },
    });
  };



  //增加模态框提交
  handleOk = e => {
    // console.log(e);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        // console.log('Received values of form: ', values);
      }
      this.sub(values);
      this.setState({
        visible: false,
      });
      message.info('添加成功！');
      setTimeout(() => this.searchFund(), 1000);
      this.props.form.resetFields();
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
                <Option value="借出">债权</Option>
                <Option value="借入">债务</Option>
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
              onClick={() => this.searchFund(param.cadType, param.cadTime)}
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
                    onClick={()=>{location.href = 'http://localhost:10010/friday/bills/userClaimsAndDebts/downloadClaimsAndDebts?cadTime='+param.cadTime}}>
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
            rowKey="cadId"
            rowClassName="editable-row"
            onChange={this.handleTableChange}
            pagination={this.state.pagination}
            loading={this.state.loading}
          />
        </EditableContext.Provider>

        <Modal
          title="添加债权或债务"
          visible={this.state.visible}
          bodyStyle={{width:'auto',height:'300px'}}
          onOk={this.handleOk}
          afterClose={this.fetch}
          htmlType="submit"
          onCancel={this.handleCancel}
        >
          <Form onSubmit={this.handleOk} className="login-form">

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadType', {
                rules: [{ required: true, message: '请选择类型' }],
              })(
                <Select
                  placeholder="选择债权或债务"
                >
                  <Select.Option value={'借出'} key={0}>债权</Select.Option>

                  <Select.Option value={'借入'} key={1}>债务</Select.Option>
                </Select>
              )}
            </Form.Item>

             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadNum', {
                rules: [{ required: true, message: '请填写涉及金额' }],
              })(
                <Input placeholder="涉及金额"
                />,
              )}
            </Form.Item>

            <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('creditor', {
                rules: [{required: true, message: '请填写债权人' }],
              })(
                <Input placeholder="债权人"
                />,
              )}
            </Form.Item>
             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('obligor', {
                rules: [{ required: true, message: '请填写债务人' }],
              })(
                <Input placeholder="债务人"
                />,
              )}
            </Form.Item>


             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadTime', {
                rules: [{ required: true, message: '请填交易时间' }],
              })(
                <Input placeholder="交易时间"
                />,
              )}
            </Form.Item>

             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadRepay', {
                rules: [{ message: '请填写已偿还金额' }],
              })(
                <Input placeholder="已偿还金额"
                />,
              )}
            </Form.Item>

             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadPlan', {
                rules: [{ message: '请填写预计偿还时间' }],
              })(
                <Input placeholder="预计偿还时间"
                />,
              )}
            </Form.Item>


             <Form.Item style={{ display: 'inline-block', width: 'calc(50% - 0px)'}}>
              {getFieldDecorator('cadRemark', {
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




const EditableCellForm = Form.create()(EditableTableClaimsAndDebts);

export default class ClaimsAndDebtsTable extends React.Component {
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
