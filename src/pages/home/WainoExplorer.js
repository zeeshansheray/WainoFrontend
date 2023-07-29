import React, { useContext, useEffect, useState } from 'react'
import { LayoutContext } from '../../context/layout.context'

import {PngIcons, SvgIcons} from '../../icons'
import CustomTextField from '../../components/CustomTextField'
import CustomButton from '../../components/CustomButton'
import { useFormik } from 'formik'
import { AuthVld } from '../../validation'
import AuthService from '../../services/Auth'
import { CircularProgress } from '@material-ui/core'
import localforage from 'localforage'

import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';

import Slider from '@material-ui/core/Slider';

export default function WainoExplorer() {
  const layout = useContext(LayoutContext)
  const [state, setState] = useState({
    loader    : false,
    mainLoader: true,
    isLoggedIn: false,
    fetchedData : []
  })
  const initValues = {
    firstName: '',
    lastName : '',
    email    : '',
  }

  useEffect(()=>{
    layout.setLayout({
      showNav: true,
      isHome : false,
    })
  },[])


  const handleSubmitFunc = async() => {
    setState({...state, loader : true})
    let payload = {...formik.values}

    console.log('payload ', payload)
    const {response,error} = await AuthService.Login({payload});

    if(response.data){
      await localforage.setItem('email', formik.values.email)
      setState({...state, loader : false, isLoggedIn : true})
    }
    else{
      setState({...state, loader : false})
    }
    console.log('response ', response );
    console.log('error ', error );

  }

  const formik = useFormik({
    validationSchema: AuthVld.LoginVld,
    initialValues : {...initValues}
  })

  const onLoadFunc = async() => {
        const {response , error} = await AuthService.FetchData();
        let filteredData = [];
        if(response.data){
          filteredData = await sortByRating(response.data)
        }

        let loggedIn = await localforage.getItem('email');
        if(loggedIn){
          setState({...state, isLoggedIn : true, mainLoader : false, fetchedData : filteredData})
        }
        else{
          setState({...state, isLoggedIn : false, mainLoader : false, fetchedData : filteredData})
        }
  }

  function sortByRating(data) {
    const compareRatings = (a, b) => {
      // Convert the ratings to numbers for comparison
      const ratingA = !isNaN(a.Rating_Vivino) ? Number(a.Rating_Vivino) : -Infinity;
      const ratingB = !isNaN(b.Rating_Vivino) ? Number(b.Rating_Vivino) : -Infinity;
  
      // Higher numeric ratings should come first
      if (ratingA > ratingB) {
        return -1;
      } else if (ratingA < ratingB) {
        return 1;
      }
  
      // Non-numeric ratings come at the bottom
      if (isNaN(ratingA) && !isNaN(ratingB)) {
        return 1;
      } else if (!isNaN(ratingA) && isNaN(ratingB)) {
        return -1;
      }
  
      // If ratings are equal or both non-numeric, maintain their original order
      return 0;
    };
  
    // Sort the array using the compareRatings function
    return data.sort(compareRatings);
  }

  useEffect(()=>{
    onLoadFunc();
  },[])

  return (
    <div id="WainoExplorer">
        {state.mainLoader ? 

       <div className='absoluteMiddle'>
         <CircularProgress size={60} color='black' /> 
       </div>:
        
        state.isLoggedIn 

        ?

        <ListingComponent state={state} setState={setState}/>

        :
        <>
          <div className='background-blur'></div>
          <div className='insideContent middle'>
            <div className='detailsSection'>
              <div className='text-center'>
                <SvgIcons.LockIcon/>
              </div>
              <h2 className='mt_8 Heading30B color-black text-center w-100'>
                  Waino
              </h2>
              <p className='color-black Caption14M w-100 text-center'>Please enter your details below to continue</p>
              <div className='w-100 mt_10'>
                <CustomTextField 
                  label = {"First Name*"}
                  name  = "firstName"
                  onChange= {formik.handleChange}
                  value ={formik.values.firstName}
                  error        = {formik.errors.firstName}
                  helperText   = {
                    formik.errors.firstName
                      ? formik.errors.firstName
                      : ""
                  }
                />
              </div>
              <div className='w-100 mt_10'>
                <CustomTextField 
                  label={"Last Name"}
                  name  = "lastName"
                  onChange= {formik.handleChange}
                  value ={formik.values.lastName}
                  error        = {formik.errors.lastName}
                  helperText   = {
                    formik.errors.lastName
                      ? formik.errors.lastName
                      : ""
                  }
                />
              </div>
              <div className='w-100 mt_10'>
                <CustomTextField 
                  label = {"Email*"}
                  name  = "email"
                  onChange= {formik.handleChange}
                  value ={formik.values.email}
                  error        = {formik.errors.email}
                  helperText   = {
                    formik.errors.email
                      ? formik.errors.email
                      : ""
                  }
                />
              </div>
              <div className='w-100 mt_24 mb_24'>
                <CustomButton 
                  btntext   = {"Continue"}
                  className = {"w-100"}
                  disabled  = {!formik.values.email || !formik.values.firstName}
                  onClick   = {handleSubmitFunc}
                  icon={state.loader &&<CircularProgress size={14} color='inherit'  />}
                />
              </div>
            </div>
          </div> 
        </>
      } 
    </div>
  )
}


const ListingComponent = ({state}) => {

  const [filters, setFilters] = useState({
    sellerName : '',
    priceRange : [0,500],
    ratingRange: [0,5],
    countries  : [],
    grape      : [],
  })

  const [filteredWines, setFilteredWines] = useState(state.fetchedData)

  const getUniqueWineryNames = (data) => {
    const uniqueNames = [];
    data.forEach((wine) => {
      if (!uniqueNames.includes(wine.wine_seller)) {
        uniqueNames.push(wine.wine_seller);
      }
    });
    return uniqueNames;
  };

  // Get unique winery names
  const uniqueWineryNames = getUniqueWineryNames(state.fetchedData);

  const getUniqueCountryNames = (data) => {
    const uniqueNames = [];
    data.forEach((wine) => {
      if (!uniqueNames.includes(wine.country)) {
        uniqueNames.push(wine.country);
      }
    });
    return uniqueNames;
  };

  // Get unique winery names
  const uniqueCountryNames = getUniqueCountryNames(state.fetchedData);

  const getUniqueGrapeNames = (data) => {
    const uniqueNames = [];
    data.forEach((wine) => {
      if (!uniqueNames.includes(wine.grape)) {
        uniqueNames.push(wine.grape);
      }
    });
    return uniqueNames;
  };

  // Get unique winery names
  const uniqueGrapeNames = getUniqueGrapeNames(state.fetchedData);

  const handleChangePrice = (event, newValue) => {
    setFilters({...filters , priceRange : newValue})
  };

  const handleChangeRatings = (event, newValue) => {
    setFilters({...filters, ratingRange : newValue})
  };

  function valuetext(value) {
    return `${value} €`;
  }

  useEffect(() => {
    // Apply filters to the fetched data
    const filteredData = state.fetchedData.filter((wine) => {
      // Apply sellerName filter
      if (filters.sellerName && wine.wine_seller !== filters.sellerName) {
        return false;
      }
  
      // Apply priceRange filter
      const winePrice = parseFloat(wine.current_price);
      if (filters.priceRange[0] > winePrice || winePrice > filters.priceRange[1]) {
        return false;
      }
  
      // Apply ratingRange filter
      const wineRating = parseFloat(wine.Rating_Vivino);
      if (filters.ratingRange[0] > wineRating || wineRating > filters.ratingRange[1]) {
        return false;
      }
  
      // Apply countries filter
      if (filters.countries.length > 0 && !filters.countries.includes(wine.country)) {
        return false;
      }
  
      // Apply grape filter
      if (filters.grape.length > 0 && !filters.grape.some(selectedGrape => selectedGrape === wine.grape)) {
        return false;
      }
  
      // All filters passed
      return true;
    });
  
    setFilteredWines(filteredData);

  },[filters.countries, filters.sellerName, filters.grape, filters.priceRange[0], filters.priceRange[1], filters.sellerName, filters.ratingRange[0], filters.ratingRange[1]])

  return(
    <div id="ListingComponent">
        <h2 className='Heading26M pt_40'>Showing Results for <span className='Heading28B'>{filteredWines.length >0 ? filteredWines.length : state.fetchedData.length}</span> wines</h2>
        <div className='d-flex mt_40 space-between'>
            <div className='w-40 leftSection'>
            <h2 className='Heading22B'>
              Seller Name
            </h2>
            <Autocomplete
            options        = {uniqueWineryNames}
            getOptionLabel = {(option) => option}
            id             = "auto-complete"
            autoComplete
            onChange={(e, value)=>setFilters({...filters, sellerName : value})}
            includeInputInList
            renderInput={(params) => (
              <TextField {...params} label="Select" variant="standard" />
            )}
          />
            <h2 className='Heading22B mt_60 d-flex space-between align-items-center'>
              Price Range
              <div className='Heading16M'>EUR</div>
            </h2>
            <div className='mt_16'>
                <div className='d-flex space-between mb_8'>
                  <p className='Caption12M'>€{filters.priceRange[0]}</p>
                  <p className='Caption12M'>{filters.priceRange[1] == 500 ? '€500 +' : filters.priceRange[1]}</p>
                </div>
                <Slider
                  value             = {filters.priceRange}
                  onChange          = {handleChangePrice}
                  valueLabelDisplay = "auto"
                  aria-labelledby   = "range-slider"
                  getAriaValueText  = {valuetext}
                  max               = {500}
                />
              </div>
              
              <h2 className='Heading22B mt_60 d-flex space-between align-items-center'>
                Ratings
              <div className='Heading16M'>Out of 5</div>
            </h2>
            <div className='mt_16'>
                <div className='d-flex space-between mb_8'>
                  <p className='Caption12M'>{filters.ratingRange[0]}</p>
                  <p className='Caption12M'>{filters.ratingRange[1]}</p>
                </div>
                <Slider
                  value             = {filters.ratingRange}
                  onChange          = {handleChangeRatings}
                  valueLabelDisplay = "auto"
                  aria-labelledby   = "range-slider"
                  max               = {5}
                />
              </div>

              <h2 className='Heading22B mt_60'>
                Country
              </h2>
              <Autocomplete
                  multiple
                  id             = "tags-standard"
                  options        = {uniqueCountryNames}
                  getOptionLabel={(option) => option}
                  onChange={(e, value)=>setFilters({...filters, countries : value})}
                  renderInput    = {(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Select"
                    />
                  )}
                />

              <h2 className='Heading22B mt_60'>
                Grape
              </h2>
              <Autocomplete
                  multiple
                  id             = "tags-standard"
                  options        = {uniqueGrapeNames}
                  getOptionLabel={(option) => option}
                  onChange={(e, value)=>setFilters({...filters, grape : value})}
                  renderInput    = {(params) => (
                    <TextField
                      {...params}
                      variant="standard"
                      label="Select"
                    />
                  )}
                />
            </div>
            <div className='w-55'>
              {(filteredWines.length > 0 ? filteredWines : state.fetchedData).map((wine)=><div className="card mb-3 position-relative">
                <div className="row no-gutters">
                  <div className="col-md-3">
                    <img src={wine.image_url} style={{objectFit : 'contain'}} width={'100%'} height={190} className="card-img" alt="..." />
                  </div>
                  <div className="col-md-9">
                    <div className="card-body">
                      <h5 className="Heading16M mb_0">{wine?.winery_name || 'N/A'}</h5>
                      <p className="Heading18B ellipses mb_8">{wine.wine_name}</p>
                      <div className='d-flex space-between'>
                        <div>
                            {wine.country && <p className="card-text"><small className="text-muted d-flex align-items-center"><span className='mr_4'><SvgIcons.LocationIcon /></span> {wine.country}</small></p>}
                        </div>
                        <div className='middle'>
                          <p className='Heading24M'>
                              {!Number.isNaN(Number(wine.Rating_Vivino)) ?  wine.Rating_Vivino : ''}
                          </p>
                          <div style={{marginTop : '-10px'}}>
                            {!Number.isNaN(Number(wine.Rating_Vivino)) &&   <StarRating rating={parseFloat(wine.Rating_Vivino)} />}
                          </div>
                          <p  className='Caption12M'>{wine.Number_of_ratings_Vivino}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                {wine.current_price && !Number.isNaN(Number(wine.current_price)) && <div class="priceSection Heading18B">
                  € {wine.current_price}
              </div>}
              </div>)}
            </div>
        </div>
    </div>
  )
}

const StarRating = ({ rating }) => {
  const MAX_STARS = 5;
  const filledStars = Math.floor(rating);
  const hasHalfStar = rating - filledStars >= 0.5;

  const renderStar = (index) => {
    if (index < filledStars) {
      return <span class="fa fa-star checked fs-14"></span>; // Full star: ★
    } else if (hasHalfStar && index === filledStars) {
      return <span class="fa checked fa fa-star-half-o fs-14"></span>; // Half star: ★½
    } else {
      return <span class="fa fa-star fs-14"></span>; // Empty star: ☆
    }
  };

  return (
    <div>
      {Array.from({ length: MAX_STARS }, (_, index) => renderStar(index))}
    </div>
  );
};



