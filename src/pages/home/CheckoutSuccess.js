import React,{useEffect , useContext} from 'react'
import { useSearchParams } from 'react-router-dom';
import { LayoutContext } from '../../context/layout.context';

export default function CheckoutSuccess() {

  const layout = useContext(LayoutContext)

  const [searchParams] = useSearchParams();

  useEffect(()=>{
    
    layout.setLayout({
      showNav : true,
      showFooter: true,

    })

  },[])

  return (
      <div id={searchParams.get('success') ? "CheckoutSuccess" : "CheckoutCancelled"} className='middle'>
      <div className="card middle">
        <div className='middle' style={{borderRadius: 200, height: 200, width: 200, background: '#F8FAF5', margin: '0 auto'}}>
          <i className="checkmark">✓</i>
        </div>
        <h1 className='text-center'>{searchParams.get('success') ? "Success" : "Cancelled"}</h1> 
        <p className='text-center'>We received your purchase request;<br /> we'll be in touch shortly!</p>
      </div>
    </div>

  )
}
