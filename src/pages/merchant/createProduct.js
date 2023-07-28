import React, { useContext , useEffect, useState}  from 'react'
import CustomTextField from '../../components/CustomTextField';
import { LayoutContext } from '../../context/layout.context';
import CustomTextArea from '../../components/CustomTextArea';
import { useFormik } from 'formik';
import { CircularProgress, RadioGroup } from '@material-ui/core';
import CustomRadio from '../../components/CustomRadio';
import CustomSelect from '../../components/CustomSelect';
import { getProductAvailibility } from '../../utils/Options';
import CustomGroupedSelect from '../../components/CustomGroupSelect';
import  ProductCategories from '../../utils/CategoriesList.json';
import  ProductDetails from '../../utils/CategoriesDetail.json';
import { SketchPicker } from 'react-color'
import { SvgIcons } from '../../icons';
import { ColorSchemeCode } from '../../enums/ColorScheme';
import ClickOutside from '../../utils/ClickOutside'
import {ProductService} from '../../services'
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import CustomAccordion from '../../components/Accordion';
import SidebarNav from '../../components/merchant/sidebar/SidebarNav';
import ImageUploading from "react-images-uploading";
import { UserContext } from '../../context/user.context';
import { showToaster } from '../../utils/utils';
import {ProductVld} from '../../validation'
import CustomButton from '../../components/CustomButton';
import { object } from 'yup';

export default function CreateProduct() {

    const layout         = useContext(LayoutContext)
    const [show,setShow] = useState({
      colorPellette    : false,
      selectedColor    : "",
      loader           : false,
      selectedSizeIndex: ''
    })
    const params               = useParams();
    const location             = useLocation();
    const navigate             = useNavigate();
    const user                 = useContext(UserContext);
    const [types , setTypes]   = useState([])
    const [models , setModels] = useState([])
    const [colors , setColors] = useState([])
    const maxNumber            = 5;

    const selectedProduct = location.state;

    useEffect(()=>{
      layout.setLayout({
        showNav   : false,
        showFooter: false,
      })
    },[])

    console.log('selectedProduct ', selectedProduct)

    const initValues = {
      category   : selectedProduct?.category  || {},
      name       : selectedProduct?.name || "",
      description: selectedProduct?.description || "",
      gender     : selectedProduct?.gender || "none",
      sizes      : selectedProduct?.sizes || [],
      models     : selectedProduct?.models || [],
      types      : selectedProduct?.types || [],
      price      : selectedProduct?.price || "",
      images     : selectedProduct?.images || [],
      colors     : selectedProduct?.colors || [],
      discount   : selectedProduct?.discount || 0,
    }
  
    const formik = useFormik({
       initialValues : {...initValues},
       isInitialValid: false,
       validationSchema: !selectedProduct?.name && ProductVld.CreateProduct
    })  

    const [images, setImages] = React.useState(formik.values.images);

    const createProductFunc = async(e) => {
      e.preventDefault();
      setShow({...show, loader : true})
      
      if(formik.values.images.length>5){
        console.log('error')
        showToaster({position : 'top-right', title: 'You cannot add more than 5 images!', severity : 'error' })
      }

      let imagePayload = {
        desiredPath : `${user._id}/product`,
        file        : formik.values.images[0]
      }

      console.log('imagePayload ', imagePayload)


      let images = [];
      for(let image of formik.values.images){
        if(typeof image != "string" ){
          console.log('yes ', image)
          imagePayload.file=image;
          const uploadImage = await ProductService.UploadImage({payload : imagePayload})
          console.log('uploadImage ', uploadImage)
          images = [...images, uploadImage.response.data]
        }
        else{
          console.log('not file type', image)
          images = [...images, image]
        }

      }

      console.log('images ', images)

      formik.setValues({...formik.values , images : [...images] })

      let payload = {...formik.values, createdBy : params.id}
      if(!payload.discount) payload.discount = 0
      payload.images = images;

      if(selectedProduct && selectedProduct?._id){
        payload._id   = selectedProduct._id
        const UpdateProduct = await ProductService.UpdateProduct({payload, toaster: true})
        if(UpdateProduct.response){
          navigate(-1)
        }
      }
      else{
        const AddProduct = await ProductService.AddProduct({payload, toaster: true})
        if(AddProduct.response){
          navigate(-1)
        }
      }
      setShow({...show, loader : false})
    }

    const handleTypeSelectFunc = (type) =>{
        if(formik.values.types.includes(type)){
         formik.values.types.splice(formik.values.types.indexOf(type), 1);
         formik.setValues({...formik.values})
        }
        else{
          formik.values.types = [...formik.values.types , type];
          formik.setValues({...formik.values})
        }
    }

    const setSizeFunc = () =>{
    let sizes = [];
      for (let category of ProductDetails){
          if(category?.category?.toLocaleLowerCase() == formik.values.category?.category?.toLocaleLowerCase()){ 
            for(let subcategory of category.subcategories){
              if((subcategory?.name?.toLocaleLowerCase()  == formik.values?.category?.subcategory.toLocaleLowerCase()) && subcategory.sizes){
                console.log('zee ', typeof subcategory.sizes)
                if(subcategory.sizes?.length > 0 && Array.isArray(subcategory.sizes)){
                   console.log('here ')
                    for(let size of subcategory.sizes){
                      let sizeObj = {
                        size        : size,
                        colors      : [],
                        quantity    : 1,
                        availibility: 'in'
                      }
                      sizes.push(sizeObj);
                  }
                }
                else{
                  console.log('else ')
                  let sizeObj = {
                    size        : subcategory.sizes,
                    colors      : [],
                    quantity    : 1,
                    availibility: 'in'
                  }
                  sizes = [sizeObj]
                }

              }
            }
          }
      }
      return sizes;
    }

    const setTypesFunc = () =>{
    let types = [];
      for (let category of ProductDetails){
          if(category?.category?.toLocaleLowerCase() == formik.values.category?.category?.toLocaleLowerCase()){
            for(let subcategory of category.subcategories){
              if((subcategory?.name?.toLocaleLowerCase()  == formik.values?.category?.subcategory.toLocaleLowerCase()) && subcategory.types){
                if(subcategory.types?.length > 0 && Array.isArray(subcategory.types)){
                  for(let type of subcategory.types){
                    types.push(type);
                  }
                }
                else{
                  types = [subcategory.types]
                }
              }
            }
          }
      }
      return types;
    }
  
    const setModelsFunc = () =>{
      let models = [];
        for (let category of ProductDetails){
            if(category?.category?.toLocaleLowerCase() == formik.values.category?.category?.toLocaleLowerCase()){
              for(let subcategory of category.subcategories){
                if((subcategory?.name?.toLocaleLowerCase()  == formik.values?.category?.subcategory.toLocaleLowerCase()) && subcategory.models){
                  if(subcategory.models?.length > 0 && Array.isArray(subcategory.models)){
                    for(let type of subcategory.models){
                      models.push(type);
                    }
                  }
                  else{
                    models = [subcategory.models]
                  }
                }
              }
            }
        }
        return models;
    }
    
    const handleModelSelectFunc = (model) =>{
      if(formik.values.models.includes(model)){
       formik.values.models.splice(formik.values.models.indexOf(model), 1);
       formik.setValues({...formik.values})
      }
      else{
        formik.values.models = [...formik.values.models , model];
        formik.setValues({...formik.values})
      }
  }

  console.log('formik errors', formik.errors);
  console.log('formik values', formik.values);
  

    useEffect(()=>{
      layout.setLayout({
        showNav : false,
        showFooter: false,
      })
    },[])

    useEffect(()=>{
      if(!selectedProduct?._id){
        let sizes = setSizeFunc();
        let types = setTypesFunc();
        let models = setModelsFunc();
        formik.setValues({...formik.values , sizes : sizes})
        setTypes(types);
        setModels(models);
      }
    },[formik.values?.category?.category, formik.values?.category?.subcategory])


    const handleSizeRemoveFunc = (index) => {
      let filteredSizes = formik.values.sizes.filter((size, idx)=>{
        return idx != index
      })
      formik.setValues({...formik.values, sizes : filteredSizes})
    }

    const addNewSizeFunc = () => {
      formik.setValues({...formik.values , sizes : [...formik.values.sizes, formik.values.sizes[formik.values.sizes.length-1]]})
    }

    const onChange = (imageList, addUpdateIndex) => {
      setImages(imageList);
      formik.setValues({...formik.values, images : imageList})
    };

    const handleColorChange = (e,index) => {
      formik.values.colors[index] = e.hex; 
      formik.setValues({...formik.values});
    }
  
    

  return (
    <div id        = "AddNewProduct" className='d-flex'>
      <SidebarNav />
      <div className='component w-100'>
        <div className='d-flex space-between w-100'>
          <h4  className = 'Heading22B color-heading'>
            Add New Product
          </h4>
          <div className = 'w-50 d-flex justify-flex-end'>
              <CustomButton 
                btntext   = {"Back"}
                varient   = "secondary"
                className = {"mr_16"}
                onClick   = {()=>navigate(-1)}
              />
          </div>
        </div>
        <div className='d-flex w-100 '>
          <div className='w-50 height-fixed'>
            <div className = 'w-100 mt_16'>
              <CustomTextField 
                className   = "w-100"
                label       = "Name*"
                onChange    = {formik.handleChange}
                value       = {formik.values.name}
                name        = "name"
                placeholder = "Enter product name"
              />
            </div>
            <div className = 'w-100 mt_16'>
              <CustomTextArea 
                className   = "w-100"
                rows        = "3"
                name        = "description"
                label       = "Description*"
                onChange    = {formik.handleChange}
                value       = {formik.values.description}
                placeholder = "Enter description"

              />
            </div>
            <div className = 'w-100 mt_16'>
                <CustomGroupedSelect 
                    value    = {formik.values.category}
                    label    = "Category*"
                    list     = {ProductCategories}
                    onChange = {(e,value)=>formik.setValues({...formik.values, category : value})}
                />
              </div>

            <div className = 'w-100 mt_16 d-flex space-between'>
              <div className = 'w-100'>
                <p   className = 'Body13M fs-14 fw-5 control-label'>Gender*</p>
                <RadioGroup
                    name      = "gender"
                    className = 'd-flex flex-row'
                    value     = {formik.values.gender}
                    onChange  = {formik.handleChange}
                    onFocus   = {formik.handleBlur}
                >
                    <CustomRadio 
                        label = "Male"
                        value = "male"
                    />
                    <CustomRadio 
                        label = "Female"
                        value = "female"
                    />
                    <CustomRadio 
                        label = "Kids"
                        value = "kids"
                    />
                      <CustomRadio 
                        label = "None"
                        value = "none"
                    />
                </RadioGroup>
              </div>
            </div>
      
            <div className = 'w-100 d-flex space-between'>
            <div className = 'w-48'>
                <CustomTextField 
                  className   = "w-100"
                  label       = "Price*"
                  type        = "number"
                  name        = "price"
                  onChange    = {formik.handleChange}
                  value       = {formik.values.price}
                  paddingLeft = "42px"
                  icon        = {<div className='mt_7 mr-8'>$</div>}
                  position    = "start"
                />
              </div>
              <div className = 'w-48'>
                <CustomTextField 
                  className   = "w-100"
                  label       = "Discount"
                  type        = "number"
                  name        = "discount"
                  paddingLeft = "42px"
                  icon        = {<div className='mt_7 mr-8'>$</div>}
                  position    = "start"
                  onChange    = {formik.handleChange}
                  value       = {formik.values.discount}
                />
              </div>
            </div>
          </div>

          {formik.values?.category?.category && formik.values.sizes.length > 0 && <div className = 'mt_16 ml_32 w-50 height-fixed'>
          <p               className = 'Body14M fs-14 fw-5 mb_8 control-label'>Sizes</p>
          {formik.values.sizes?.length > 0 && formik.values.sizes.map((size, idx)=>
            <div className='mb_8 d-flex align-items-center flex-wrap'>
              <div className='w-90'>
               <CustomAccordion handleChangeFunc={(size)=>{formik.values.sizes[idx].size =size; formik.setValues({...formik.values})}} Component = {<SizeComponent show={show}  idx={idx} size={size} setShow={setShow} formik={formik}  /> } Title = {size.size} />
              </div>
              <div className='d-flex justify-flex-end w-5 ml_8 '>
                <i onClick={()=>handleSizeRemoveFunc(idx)} className='fal fa-trash trash cp middle' style={{color: 'red'}}></i>
              </div>
          </div>
          )}
          <p className='color-primary50 Body13R mt_4 cp' onClick={addNewSizeFunc}>Add New Size</p>
        </div>}
        </div>

        {types.length > 0 && <>
        <p className = 'Body14M fs-14 fw-5 mb_8 control-label mt_16'>Types:</p>
        <div className='d-flex flex-wrap'>
        {
          types.map((type)=>
            <div onClick={()=>handleTypeSelectFunc(type)} className={`${formik.values.types.includes(type) && 'selectedType'} cp Body14R singleType capitalize`}>{type}</div>
          )
        }
        </div>
        </>}
        {console.log('models ', models)}
        {models.length > 0 && <>
        <p className = 'Body14M fs-14 fw-5 mb_8 control-label mt_16'>Models:</p>
        <div className='d-flex flex-wrap'>
        {
          models.map((model)=>
            <div onClick={()=>handleModelSelectFunc(model)} className={`${formik.values.models.includes(model) && 'selectedType'} capitalize cp Body14R singleType`}>{model}</div>
          )
        }
        </div>
        </>}

        {formik.values.sizes.length==0 && <><p   className = 'Body14M fs-14 fw-5 control-label mt_16'>Colors</p>
        <div className = 'position-relative d-flex align-items-center'>
            {formik.values.colors.map((color, index)=>
              <ClickOutside onClick   = {()=>setShow({...show, colorPellette : false, selectedColor : ''})}>
              <div          className = 'singleColorBox borderRadius-50 mr_16 mt_5 cp position-relative' onClick = {()=>{setShow({...show, selectedColor : index, selectedSizeIndex : index, colorPellette : true});}} style = {{height : 30, width : 30, backgroundColor : color}}>
              <div          className = 'position-absolute' style                                                = {{top: 32, left : 10, zIndex : 100000000}}>
                      {show.colorPellette && show.selectedSizeIndex == index && index == show.selectedColor && 
                      <SketchPicker 
                        onChange = {(e)=>handleColorChange(e,index)}
                      
                      />}
                    </div>  
                    </div>
              </ClickOutside>
            )}
            <CustomButton 
              btntext   = {"Add Colors"}
              className = "mt_8"
              varient   = "tertiary"
              icon      = <SvgIcons.Add color = {ColorSchemeCode.primary50}/>
              onClick    = {()=>{formik.values.colors = [...formik.values.colors, '#000000']; formik.setValues({...formik.values})} }
            />
        </div></>}

                    
        <ImageUploading
                multiple
                value      = {images}
                onChange   = {onChange}
                maxNumber  = {maxNumber}
                dataURLKey = "data_url"
                acceptType = {["jpg", "png", "jpeg"]}
              >
                {({
                  imageList,
                  onImageUpload,
                  onImageRemoveAll,
                  onImageUpdate,
                  onImageRemove,
                  isDragging,
                  dragProps
                }) => (
                  <div className="upload__image-wrapper">
                    <label className="Body13M lh-16 mb_8 capitalize mt_16">Upload Images Upto 5*</label>
                    <div className='Caption10R color-info40'>Upload 1100x1100 pixel images for best results.</div>
                    <div className='d-flex'>
                    <div>
                      <div className='d-flex'>
                        <button
                          style     = {isDragging ? { color: "red" } : null}
                          onClick   = {onImageUpload}
                          className = "imageUploader"
                          {...dragProps}
                        >
                          Click or Drop here
                        </button>
                        <div className='middle'>
                          <CustomButton 
                            onClick  = {onImageRemoveAll}
                            varient  = "warningSecondary"
                            btntext  = {"Remove All"}
                            disabled = {formik.values.images.length < 1 }
                          />
                        </div>
                      </div>
                    </div>
                    <div className='d-flex ml_32 align-items-center justify-flex-end'>
                      {imageList.map((image, index) => (
                        <div key={index} className="image-item mr_32 position-relative">
                          <img src={image.data_url || image} alt="" height={150} width="130" className='singleImage' />
                              <a  onClick={() => onImageRemove(index)}    className="borderRadius-50 position-absolute middle cp removeIcon"><SvgIcons.CrossIcon color={ColorSchemeCode.black}/></a>
                        </div>
                      ))}
                    </div>
                    </div>
                  </div>
                )}
        </ImageUploading>

          <CustomButton 
                btntext   = {selectedProduct?._id ? "Update Product" : "Add Product"}
                onClick   = {(e)=>createProductFunc(e)}
                className = "w-50 mt_32"
                disabled  = {Object.keys(formik.errors).length > 0 || show.loader}
                icon      = {show.loader && <CircularProgress size={14} color="inherit" />}
          />
          
              
      </div>
        
    </div>
  )
}


const SizeComponent = ({show, setShow, formik, size, idx}) =>{

  const handleColorChange = (e,index) => {
    formik.values.sizes[idx].colors[index] = e.hex; 
    formik.setValues({...formik.values});
  }

  return(
    <div className = 'w-100'>
    <div className = 'w-100'>
        <p   className = 'Body14M fs-14 fw-5 control-label'>Colors</p>
        <div className = 'position-relative d-flex align-items-center'>
            {formik.values.sizes[idx].colors.map((color, index)=>
              <ClickOutside onClick   = {()=>setShow({...show, colorPellette : false, selectedColor : ''})}>
              <div          className = 'singleColorBox borderRadius-50 mr_16 mt_5 cp position-relative' onClick = {()=>{setShow({...show, selectedColor : index, selectedSizeIndex : idx, colorPellette : true});}} style = {{height : 30, width : 30, backgroundColor : color}}>
              <div          className = 'position-absolute' style                                                = {{top: 32, left : 10, zIndex : 100000000}}>
                      {show.colorPellette && show.selectedSizeIndex == idx && index == show.selectedColor && 
                      <SketchPicker 
                        onChange = {(e)=>handleColorChange(e,index)}
                      
                      />}
                    </div>  
                    </div>
              </ClickOutside>
            )}
            <CustomButton 
              btntext   = {"Add Colors"}
              className = "mt_8"
              varient   = "tertiary"
              icon      = <SvgIcons.Add color = {ColorSchemeCode.primary50}/>
              onClick    = {()=>{formik.values.sizes[idx].colors = [...formik.values.sizes[idx].colors, '#000000']; formik.setValues({...formik.values})} }
            />
        </div>
    </div>

        <div className = 'w-100 d-flex space-between mt_16'>
        <div className = 'w-48'>
              <CustomTextField 
                className   = "w-100"
                label       = "Quantity"
                type        = "number"
                placeholder = "Enter quantity"
                name        = "quantity"
                onChange    = {(e)=>{formik.values.sizes[idx].quantity =e.target.value; formik.setValues({...formik.values})} }
                value       = {formik.values.sizes[idx].quantity}
              />
            </div>
            <div className = 'w-48'>
              <CustomSelect 
                className = "w-100"
                label     = "Availibility"
                name      = "availibility"
                options   = {getProductAvailibility()}
                onChange    = {(e)=>{formik.values.sizes[idx].availibility =e.target.value; formik.setValues({...formik.values})} }
                value     = {formik.values.sizes[idx].availibility}
              />
            </div>
        </div>
    </div>
  )
}