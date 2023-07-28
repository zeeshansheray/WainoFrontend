import React, {useEffect , useContext, useState} from 'react'
import { LayoutContext } from '../../context/layout.context';
import SidebarNav from '../../components/merchant/sidebar/SidebarNav';
import ProductService from '../../services/Product';
import Loader from '../../components/Loader';
import Graph from '../../components/Graph';
import { useParams } from 'react-router-dom';

export default function Dashboard() {
  const params = useParams()
  const [state, setState] = useState({
    orders      : [],
    totalSales  : 0,
    averageSales: 0,
    topProduct  : '',
    loader      : true
  })

  const [orderData, setOrderData] = useState({});

  
  const layout = useContext(LayoutContext);

  useEffect(()=>{
    layout.setLayout({
      showNav   : false,
      showFooter: false,
    })
    onLoad();
  },[])

  console.log('state ', state);

  const onLoad = async() => {
    setState({...state, loader : true})
    let query = {
      merchantId : params.id,
    }
    let {response, error} = await ProductService.merchantAnaltytics({query : query});
    if(response.data){
      console.log('response ', response)
      let totalSales = 0;
      response.data.orders.forEach((order)=>{
        totalSales += order.totalAmount;
      })
      let topProduct = findMostRepeatedProductWithQuantity(response.data.orders);
      setState({...state, topProduct : topProduct, averageSales: Math.round(totalSales/response.data.orders.length) || 0, totalSales : totalSales , orders : response.data.orders, users: response.data.users,   merchants: response.data.merchants, loader : false})
    }
    else{
      console.log('error ', error)
      setState({...state, loader : false})
    }
  }

  const [startDateOrder, setStartDateOrder] = useState(getDefaultStartDate());
  const [endDateOrder, setEndDateOrder] = useState(getDefaultEndDate());

  useEffect(() => {
    const now = new Date();
    const monthLabels = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const orderCounts = [];
  
    let start = startDateOrder ? new Date(startDateOrder) : new Date(now.getFullYear(), 0, 1);
    let end = endDateOrder ? new Date(endDateOrder) : now;
  
    const isMonthly = startDateOrder && endDateOrder && start.getMonth() !== end.getMonth();
  
    let currentDate = new Date(start);
  
    while (currentDate <= end) {
      const year = currentDate.getFullYear();
      const month = isMonthly ? currentDate.getMonth() : null;
      const day = isMonthly ? null : currentDate.getDate();
      const startDate = isMonthly ? new Date(year, month, 1, 0, 0, 0).getTime() : new Date(year, month, day, 0, 0, 0).getTime();
      const endDate = isMonthly ? new Date(year, month + 1, 0, 23, 59, 59).getTime() : new Date(year, month, day, 23, 59, 59).getTime();
  
      // Filter the orders created on this date or month
      const ordersInTime = state.orders.filter(
        (order) => order.created >= startDate && order.created <= endDate
      );
  
      // Add the number of orders created to the orderCounts array
      orderCounts.push(ordersInTime.length);
  
      if (isMonthly) {
        currentDate.setMonth(currentDate.getMonth() + 1);
      } else {
        currentDate.setDate(currentDate.getDate() + 1);
      }
    }
  
    console.log('orderCounts ', orderCounts)
  
    setOrderData({
      labels: isMonthly ? monthLabels.slice(start.getMonth(), end.getMonth() + 1) : orderCounts.map((_, i) => new Date(start.getFullYear(), start.getMonth(), start.getDate() + i).toLocaleDateString()),
      datasets: [
        {
          label: 'Orders',
          data: orderCounts,
          fill: false,
          borderColor: 'rgb(75, 192, 192)',
          tension: 0.1
        }
      ]
    });
  }, [state.orders, startDateOrder, endDateOrder]);

    const handleStartDateChangeOrder = (e) => {
      setStartDateOrder(e.target.value);
    };

    const handleEndDateChangeOrder= (e) => {
      setEndDateOrder(e.target.value);
    };


    function getDefaultStartDate() {
      const now = new Date();
      return `${now.getFullYear()}-01-01`;
    }

    function getDefaultEndDate() {
      const now = new Date();
      const year = now.getFullYear();
      const month = (now.getMonth() + 1).toString().padStart(2, '0');
      const date = now.getDate().toString().padStart(2, '0');
      return `${year}-${month}-${date}`;
    }

    function findMostRepeatedProductWithQuantity(arr) {
      const productCounts = {};
      let maxCount = 0;
      let mostRepeatedProduct = null;
    
      for (const obj of arr) {
        const cart = obj.cart;
        for (const item of cart) {
          const productDetails = item.productDetails;
          const productId = productDetails._id;
          const productName = productDetails.name;
          const productQty = item.quantity;
    
          const productKey = `${productId}-${productName}`;
          productCounts[productKey] = (productCounts[productKey] || 0) + productQty;
          if (productCounts[productKey] > maxCount) {
            maxCount = productCounts[productKey];
            mostRepeatedProduct = { id: productId, name: productName, quantity: productQty };
          }
        }
      }
    
      return mostRepeatedProduct;
    }
  
  return (
    <>{
      state.loader ? 

      <Loader /> 
      
      :
    <div id="AdminDashboard" className='d-flex'>
      <SidebarNav/> 
      <div className='component w-100'>
          <div className='topRow'>
            <div className='singleBox'>
                <p className='Body14R color-Heading'>Total Orders</p>
                <h4 className='Heading24M color-Heading mt_4'>{state.orders.length}</h4>
            </div>
            <div className='singleBox'>
                <p className='Body14R color-Heading'>Total Ongoing Orders</p>
                <h4 className='Heading24M color-Heading mt_4'>{state.orders.length}</h4>
            </div>
            <div className='singleBox'>
                <p className='Body14R color-Heading'>Top Product</p>
                <h4 className='Heading24M color-Heading mt_4 capitalize'>{state?.topProduct?.name || "N/A"} <span className='Heading13M'>{state?.topProduct?.quantity ? "("+state?.topProduct?.quantity+")" : ""}</span></h4>
            </div>
            <div className='singleBox'>
                <p className='Body14R color-Heading'>Average Order</p>
                <h4 className='Heading24M color-Heading mt_4'>$ {state.averageSales}</h4>
            </div>
            <div className='singleBox'>
                <p className='Body14R color-Heading'>Total Sales</p>
                <h4 className='Heading24M color-Heading mt_4'>$ {state.totalSales}</h4>
            </div>
       
          </div>

          <div className='graphBackground mt_32'>
            <div className='d-flex w-100 space-between mb_50'>
              <div>
                  <h3 className='Heading16M color-Heading'>Total Orders</h3>
                  <h1 className='Heading32M color-Heading'>{state.orders.length}</h1>
              </div>
              <div className='d-flex'>
                <div className='d-flex flex-column mr_16'>
                  <label className='BodyB15R'>Start Date:</label>
                  <input className='dateField Body14R uppercase' min={"2023-01-01"} type="date" value={startDateOrder} onChange={handleStartDateChangeOrder} />
                </div>
                <div className='d-flex flex-column'>
                  <label className='BodyB15R'>End Date:</label>
                  <input className='dateField Body14R uppercase' min={startDateOrder}  type="date" value={endDateOrder} onChange={handleEndDateChangeOrder} />
                </div>
              </div>
            </div>
              <Graph data={orderData} type="line" height="450px"/>
          </div>
      </div>
    </div>
    }
    </>
  )
}
