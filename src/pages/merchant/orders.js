import React, { useEffect, useState } from 'react'
import {SvgIcons} from '../../icons';
import { LayoutContext } from '../../context/layout.context';
import { useContext } from 'react';
import CustomTextField from '../../components/CustomTextField';
import SidebarNav from '../../components/merchant/sidebar/SidebarNav';
import {ProductService} from '../../services'
import { enums } from '../../enums';
import { utils } from '../../utils';
import { UserContext } from '../../context/user.context';
import Loader from '../../components/Loader';

function Orders() {
  const layout = useContext(LayoutContext)
  const user = useContext(UserContext)

  const [state, setState] = useState({
    orders : [],
    loader : false,
  })

  useEffect(()=>{
    onLoad();
    layout.setLayout({
      showNav : false,
      showFooter: false,

    })
  },[])

  const onLoad = async() => {
    setState({...state, loader : true})
    let {response, error} = await ProductService.GetAllOrders();
    if(response?.data){
      filterMerchantOrders(response.data)
    }
    else{
      setState({...state, loader : false})
    }
  }

  const filterMerchantOrders = (orders) => {
    let orderList = [];
    for(let order of orders){
      for(let product of order.cart ){
        if(product.productDetails.createdBy == user._id){
            let orderRecieved = {
              product     : product.productDetails,
              created     : order.created,
              amount      : product.productDetails.price - product.productDetails.discount,
              customerName: order?.firstName ? order.firstName + order.lastName           : 'Zeeshan Ali',
              location    : 'Ayesha Manzil Block 7 FB area Karachi',
              status      : 'In-progress',
              productName : product.productDetails.name,
            }
            orderList.push(orderRecieved);
        }
      }
    }
    setState({...state, orders : orderList, loader : false})
  }


  return (
      <div id="Orders" className='d-flex'>
        {state.loader ? 

          <Loader/> 

          :
        
        <>
          <SidebarNav />  
        <div className="component  w-100">
            <h4  className = 'Heading22B color-heading'>
              Products Ordered
            </h4>
            {state.orders.length > 0 ? <>
              <div className=' w-100  d-flex justify-flex-end'>
                    <div className='w-25 d-flex justify-flex-end'>
                      <CustomTextField 
                            className   = "w-100"
                            placeholder = "Search Order"
                            icon        = {<SvgIcons.SearchIcon fill={"#84889b"}/>}
                            position    = "start"
                            top         = {7}
                            left        = {10}
                        />
                    </div>
                </div>
              <div class="table-responsive mt_32 overflow-hidden">
                      <table className="table">
                        <thead>
                          <tr>
                            <th>#</th>
                            <th className="th-lg">Customer Name</th>
                            <th className="th-lg">Product Name</th>
                            <th className="th-lg">Location</th>
                            <th className="th-lg">Amount</th>
                            <th className="th-lg">Date</th>
                            <th className="th-lg">Delivery Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {state.orders.length > 0 && state?.orders?.map((order,idx)=><tr>
                            <th scope="row">{++idx}</th>
                            <td>{order.customerName}</td>
                            <td className='capitalize'>{order.productName}</td>
                            <td>{order.location}</td>
                            <td>{order.amount} $</td>
                            <td>{utils.getDate(order.created)}</td>
                            <td>{order.status}</td>
                          </tr>)}
                        </tbody>
                      </table>
              </div>
            </>
            
            :
            <div className='middle' style={{height : '80vh'}}>

            <h1>No Orders Found </h1>
            </div>
          
          }
        </div>
        </>}
        </div>
    )
}

export default Orders