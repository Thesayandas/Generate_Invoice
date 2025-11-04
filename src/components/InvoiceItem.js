import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { BiTrash } from "react-icons/bi";
import EditableField from './EditableField';

class InvoiceItem extends React.Component {
  render() {
    const onItemizedItemEdit = this.props.onItemizedItemEdit;
    const rowDel = this.props.onRowDel;
    const currency = this.props.currency || "₹"; // Default currency INR

    const itemTable = this.props.items.map((item) => (
      <ItemRow
        onItemizedItemEdit={onItemizedItemEdit}
        item={item}
        onDelEvent={rowDel.bind(this)}
        key={item.id}
        currency={currency}
      />
    ));

    return (
      <div className="p-3 border rounded bg-light shadow-sm">

        {/* ====== HEADER WITH COMPANY LOGO ====== */}
        <div className="d-flex align-items-center mb-3 border-bottom pb-2">
          <img
            src="../TIAS Logo.png"
            alt="TIAS Logo"
            style={{ height: "60px", marginRight: "15px" }}
          />
          <h4 className="fw-bold mb-0 text-primary">TIAS Invoice System</h4>
        </div>

        {/* ====== INVOICE TABLE ====== */}
        <Table bordered hover responsive>
          <thead className="table-secondary">
            <tr>
              <th>ITEM</th>
              <th>QTY</th>
              <th>PRICE / RATE</th>
              <th className="text-center">ACTION</th>
            </tr>
          </thead>
          <tbody>{itemTable}</tbody>
        </Table>

        <div className="d-flex justify-content-end">
          <Button className="fw-bold" onClick={this.props.onRowAdd}>
            Add Item
          </Button>
        </div>

        {/* ====== FOOTER NOTE ====== */}
        <div className="text-center text-muted mt-4 small border-top pt-2">
          This is a system-generated invoice. No signature required.
        </div>
      </div>
    );
  }
}

class ItemRow extends React.Component {
  onDelEvent() {
    this.props.onDelEvent(this.props.item);
  }

  render() {
    const { item, currency } = this.props;
    return (
      <tr>
        <td style={{ width: '100%' }}>
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              type: "text",
              name: "name",
              placeholder: "Item name",
              value: item.name,
              id: item.id,
            }}
          />
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              type: "text",
              name: "description",
              placeholder: "Item description",
              value: item.description,
              id: item.id,
            }}
          />
        </td>
        <td style={{ minWidth: '70px' }}>
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              type: "number",
              name: "quantity",
              min: 1,
              step: "1",
              value: item.quantity,
              id: item.id,
            }}
          />
        </td>
        <td style={{ minWidth: '130px' }}>
          <EditableField
            onItemizedItemEdit={this.props.onItemizedItemEdit}
            cellData={{
              leading: currency,
              type: "number",
              name: "price",
              min: 1,
              step: "0.01",
              precision: 2,
              textAlign: "text-end",
              value: item.price,
              id: item.id,
            }}
          />
        </td>
        <td className="text-center" style={{ minWidth: '50px' }}>
          <BiTrash
            onClick={this.onDelEvent.bind(this)}
            style={{ height: '33px', width: '33px', padding: '7.5px' }}
            className="text-white mt-1 btn btn-danger"
          />
        </td>
      </tr>
    );
  }
}

export default InvoiceItem;


