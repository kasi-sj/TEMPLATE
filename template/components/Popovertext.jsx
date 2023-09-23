'use client'
import { ScrollArea } from '@/components/ui/scroll-area'

const Popovertext = ({ text }) => {
  const data = text;
  return (
    <div className={`flex flex-col w-[400px] h-[196px] p-2 px-2 border-solid border-black border-[1px] rounded-sm`} >
      <h1 className='first:self-center font-semibold '>Extracted Text</h1>
      <ScrollArea>{(
  <div>{ data!=null && (
    <div >
    <p>Hospital Name : {data?.hospital_name}</p>
    <p>Hospital Phone : {data?.hospital_contact?.phone}</p>
    <p>Hospital Address : {data?.hospital_contact?.address}</p>
    <p>Hospital Mail : {data?.hospital_contact?.mail}</p>
    <p>Patent Name : {data?.patent_name}</p>
    <p>Patent Phone : {data?.patent_contact?.phone}</p>
    <p>Patent Address : {data?.patent_contact?.address}</p>
    <p>Patent Mail : {data?.patent_contact?.mail}</p>
    <p>invoice no : {data?.invoice_no}</p>
    <table>
      <tr>
        <th>no</th>
        <th>name</th>
        <th>quantity</th>
        <th>price</th>
        <th>tax</th>
      </tr>
    {
      data.product_details && 
      (data?.product_details).map((item,i)=>( 
        <tr> 
          <td>{item?.product_no}</td> 
          <td>{item?.product_name}</td>
          <td>{item?.product_quantity}</td>
          <td>{item?.product_price}</td>
          <td>{item?.product_tax}</td>
        </tr>))
    }
    </table>
    <p>total amount : {data?.total_amount}</p>
    <p>total tax : {data?.total_tax}</p>
    </div>
  )}
  </div>
  )}</ScrollArea>
    </div>
  )
}

export default Popovertext