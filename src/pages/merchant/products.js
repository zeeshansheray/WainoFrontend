import React from 'react'
import Navbar from '../../components/merchant/Navbar'
import PngIcons from '../../icons/png.icon';
import { useNavigate, Link, useParams } from 'react-router-dom';
import CustomTextField from '../../components/CustomTextField';
import SvgIcons from '../../icons/svg.icon';
import { LayoutContext } from '../../context/layout.context';
import { useEffect, useState } from 'react';
import { useContext } from 'react';
import CustomButton from '../../components/CustomButton';
import CustomModal from '../../components/CustomModal';
import CreateProduct from './createProduct';
import { ProductService } from '../../services';
import DeleteModal from '../../components/DeleteModal';
import Loader from '../../components/Loader';
import SidebarNav from '../../components/merchant/sidebar/SidebarNav';



export default function Products() {

  const layout            = useContext(LayoutContext)
  const params            = useParams();
  const navigate          = useNavigate();
  const [state, setState] = useState({
    products       : [],
    selectedProduct: {},
  })

  const [show, setShow] = useState({
    modal       : false,
    deleteModal : false,
    deleteLoader: false,
    mainLoader  : true,
  })

  useEffect(()=>{
    layout.setLayout({
      showNav : false,
      showFooter: false,
    })
    OnLoad();
  },[])

  const handleRefresh = (refresh) =>{
    if(refresh){
      OnLoad();
    }
  }


  const OnLoad = async() =>{
    setShow({...show, mainLoader: true})
    let query = {
      createdBy : params.id,
    }
    console.log('query ', query);
    const {response, error} =  await ProductService.GetProducts({query})
    if(response){
      setState({...state, products : response.data});
    }
    setShow({...show, mainLoader: false})
    console.log('ProductsList ', response)
  }

  const handleDeleteFunc = async() =>{
    console.log('hi')
    setShow({...show, deleteLoader : true})
    let payload = {_id : state.selectedProduct._id, delete : true }
    console.log('paylpad ', payload)
    const {response, error} = await ProductService.UpdateProduct({payload, toaster: true})
      if(response){
        console.log('response ', response)
        handleRefresh(true);
      }
      setShow({...show, deleteLoader : false, deleteModal : false})

  }


  return (
    <div className='d-flex w-100'> 
        <SidebarNav/>
        {show.mainLoader ? 
        
        <Loader/>

        :
        
        <div id="MerchantProducts" className='w-100'>
            <h4  className = 'Heading22B color-heading'>
              Products
            </h4>
            <div className=' w-100  d-flex justify-flex-end align-items-center'>
                  <div className='w-25 d-flex justify-flex-end'>
                    <CustomTextField 
                          className   = "w-100"
                          placeholder = "Search Product"
                          icon        = <SvgIcons.SearchIcon fill={"#84889b"}/>
                          position    = "start"
                          top         = {7}
                          left        = {10}
                      />
                  </div>
                  <CustomButton 
                    className = {"ml_8"}
                    btntext   = "Add New Product"
                    onClick   = {()=>navigate('create')}
                  />
              </div>
            <div id="MerchantShop">
                <section id="product1">
                <div className="pro-container">
                    {state.products.map((product, idx)=>
                    <div className="pro" 
                    >
                      {console.log('product.images ', product.images)}
                    <img height={277} width={277} src={product.images.length > 0 ? product.images[0] :  PngIcons.products.product1} alt />
                    <div className="des">
                        <h5 className='capitalize'>{product.name}</h5>
                        <div className="star">
                        {product?.rating?.map(()=><i className="fas fa-star" />)}
                        </div>
                        <h4>QR {product.price - product.discount}</h4>
                    </div>
                    <a ><i onClick={()=>{setShow({...show, deleteModal : true}); setState({...state, selectedProduct : product})} } className="fal fa-trash trash" style={{right: 60}} /><i onClick={()=>{navigate(`${product._id}`, {state : product})}} className="fal fa-edit cart" /></a>
                    </div>)}
                </div>
                </section>
                <section id="pagination" className="section-p1">
                  <CustomModal 
                    component = {<DeleteModal 
                      title    = {`Product ${state.selectedProduct.name}`}
                      onCancel = {()=>setShow({...show, deleteModal : false})}
                      onDelete = {handleDeleteFunc}
                  />}
                    open      = {show.deleteModal}
                    minWidth  = "650px"
                    onClose   = {()=>setShow({...show, deleteModal : false})}
                />
                </section>
            </div>
        </div>}
    </div>
  )
}


