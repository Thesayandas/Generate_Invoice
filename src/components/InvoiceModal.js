import React from 'react'; 
import 'bootstrap/dist/css/bootstrap.min.css';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button';
import Table from 'react-bootstrap/Table';
import Modal from 'react-bootstrap/Modal';
import { BiPaperPlane, BiCloudDownload } from "react-icons/bi";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

function GenerateInvoice() {
  html2canvas(document.querySelector("#invoiceCapture")).then((canvas) => {
    const imgData = canvas.toDataURL('image/png', 1.0);
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'pt',
      format: [612, 792]
    });
    pdf.internal.scaleFactor = 1;
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save('invoice-001.pdf');
  });
}

class InvoiceModal extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Modal show={this.props.showModal} onHide={this.props.closeModal} size="lg" centered>
          <div id="invoiceCapture">

            {/* ====== HEADER WITH LOGO ====== */}
            <div className="d-flex flex-row justify-content-between align-items-center bg-light w-100 p-4 border-bottom">
              <div className="d-flex align-items-center">
                <img
                  src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhx5qd_VIv2EjrNhDrQYwr_Gw5OyS-wOVwNMRcADwyIWTyHOMU1NrSJAajQtH8Vsg1h0H1CNoGWlV7cs5FSNegTsjOtwzco14dCnp6ZiOc5mlxAHjT0y6lZS6KHqbOg53RsnQT7kFE4F9IJf0J77iOrowvt9xKX9CqdbsgJsxp60pfxcG_w-tWWsbHYHwal/s200/TIAS%20Logo.png"
                  alt="Company Logo"
                  style={{ height: '50px', marginRight: '15px' }}
                />
                <div>
                  <h4 className="fw-bold mb-1">{this.props.info.billFrom || 'TIAS Solutions'}</h4>
                  <h6 className="text-secondary mb-0">Official Invoice</h6>
                </div>
              </div>
              <div className="text-end">
                <h6 className="fw-bold mb-1">Invoice #: {this.props.info.invoiceNumber || ''}</h6>
                <h6 className="fw-bold mt-1 mb-2">Amount Due:</h6>
                <h5 className="fw-bold text-secondary">
                  {this.props.currency || '₹'} {this.props.total}
                </h5>
              </div>
            </div>

            {/* ====== BILLING DETAILS ====== */}
            <div className="p-4">
              <Row className="mb-4">
                <Col md={4}>
                  <div className="fw-bold">Billed To:</div>
                  <div>{this.props.info.billTo || ''}</div>
                  <div>{this.props.info.billToAddress || ''}</div>
                  <div>{this.props.info.billToEmail || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold">Billed From:</div>
                  <div>{this.props.info.billFrom || ''}</div>
                  <div>{this.props.info.billFromAddress || ''}</div>
                  <div>{this.props.info.billFromEmail || ''}</div>
                </Col>
                <Col md={4}>
                  <div className="fw-bold mt-2">Date Of Issue:</div>
                  <div>{this.props.info.dateOfIssue || ''}</div>
                </Col>
              </Row>

              {/* ====== ITEMS TABLE ====== */}
              <Table className="mb-0">
                <thead>
                  <tr>
                    <th>QTY</th>
                    <th>DESCRIPTION</th>
                    <th className="text-end">PRICE</th>
                    <th className="text-end">AMOUNT</th>
                  </tr>
                </thead>
                <tbody>
                  {this.props.items.map((item, i) => (
                    <tr id={i} key={i}>
                      <td style={{ width: '70px' }}>{item.quantity}</td>
                      <td>{item.name} - {item.description}</td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency || '₹'} {item.price}
                      </td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency || '₹'} {item.price * item.quantity}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {/* ====== TOTALS SECTION ====== */}
              <Table>
                <tbody>
                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>SUBTOTAL</td>
                    <td className="text-end" style={{ width: '100px' }}>
                      {this.props.currency || '₹'} {this.props.subTotal}
                    </td>
                  </tr>

                  {this.props.taxAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>TAX</td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency || '₹'} {this.props.taxAmmount}
                      </td>
                    </tr>
                  }

                  {this.props.discountAmmount != 0.00 &&
                    <tr className="text-end">
                      <td></td>
                      <td className="fw-bold" style={{ width: '100px' }}>DISCOUNT</td>
                      <td className="text-end" style={{ width: '100px' }}>
                        {this.props.currency || '₹'} {this.props.discountAmmount}
                      </td>
                    </tr>
                  }

                  <tr className="text-end">
                    <td></td>
                    <td className="fw-bold" style={{ width: '100px' }}>TOTAL</td>
                    <td className="text-end" style={{ width: '100px' }}>
                      {this.props.currency || '₹'} {this.props.total}
                    </td>
                  </tr>
                </tbody>
              </Table>

              {/* ====== NOTES ====== */}
              {this.props.info.notes &&
                <div className="bg-light py-3 px-4 rounded">
                  {this.props.info.notes}
                </div>
              }
            </div>

            {/* ====== FOOTER MESSAGE ====== */}
            <div className="text-center py-3 border-top text-secondary small">
              This is a system-generated invoice. No signature required.
            </div>
          </div>

          {/* ====== ACTION BUTTONS ====== */}
          <div className="pb-4 px-4">
            <Row>
              <Col md={6}>
                <Button variant="primary" className="d-block w-100" onClick={GenerateInvoice}>
                  <BiPaperPlane style={{ width: '15px', height: '15px', marginTop: '-3px' }} className="me-2" />
                  Send Invoice
                </Button>
              </Col>
              <Col md={6}>
                <Button variant="outline-primary" className="d-block w-100 mt-3 mt-md-0" onClick={GenerateInvoice}>
                  <BiCloudDownload style={{ width: '16px', height: '16px', marginTop: '-3px' }} className="me-2" />
                  Download Copy
                </Button>
              </Col>
            </Row>
          </div>
        </Modal>
        <hr className="mt-4 mb-3" />
      </div>
    );
  }
}

export default InvoiceModal;
