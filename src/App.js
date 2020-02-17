import React from 'react';
import styles from "./style.module.css";
import IosSearch from 'react-ionicons/lib/IosSearch';
import Loader from "./Loader.gif";
import axios from "axios"
import {PageNavigation} from "./PageNavigation";

class App extends React.Component {

  constructor(props){
    super(props)
    
this.state={
  results:{},
  query:"",
  message:"",
  isLoading:false,
  totalPageNum:0,
  totalResults:0,
  currentPageNum:0
};
  
this.cancel = "";
}




getPageCounts = (total, denominator) => {

  const divisible = 0 === total % denominator;
  const valueTobeAdded = divisible? 0 : 1;
  return Math.floor(total/denominator) + valueTobeAdded;
  
  }
  
 

 fetchResult = (updatedPageNum ="", query) => {
const pageNumber = updatedPageNum? `&page=${updatedPageNum}`:"";
const searchUrl = `https://pixabay.com/api/?key=15280846-0ac945cc5a9bdd1c8484537a7&q=${query}${pageNumber}`

if(this.cancel){

  this.cancel.cancel();
}
  this.cancel= axios.CancelToken.source();
  
axios.get(searchUrl,{ CancelToken:this.cancel.token})
.then(res =>{
  const total = res.data.total;
  const totalPageCounts = this.getPageCounts(total, 20);
  console.log('The request was', res.data)
  const resultNotFoundMsg = !res.data.hits.length
                           ?"There are no more search results. Please try a different search"
                           :"";        

this.setState({results:res.data.hits, 
  message:resultNotFoundMsg, 
  isLoading:false,

totalResults:total,

totalPageNum:totalPageCounts,

currentPageNum:pageNumber
})

})

.catch(err =>{
  if(axios.isCancel(err) || err) {
    this.setState({
      isLoading:false,
      message:"Failed to fetch the data please check your network "

    })
}

});

  }
  
handleChange = e =>{
 const query = e.target.value;

  if(!query) {
  this.setState({query, results:{}, message:"", totalPageNum:0, totalResults:0, currentPageNum:0});
  }else{
 this.setState({query, message:"", isLoading:true}, () =>{
 this.fetchResult(1, query)
 });

 }
}




handlePageClick = (type) =>{
  //event.preventDefault();

  const updatePageNumber = 'prev' === type? this.state.currentPageNum -1
                                      :this.state.currentPageNum +1;

  if(!this.state.isLoading){ 

    this.setState({isLoading:true, message:""},() =>{
   
   
      this.fetchResult(updatePageNumber, this.state.query);



    })
  }                                  


}



renderSearchResult = () =>{
const {results} = this.state
if(Object.keys(results).length && results.length ){

  return( 
  <div className={styles["render-container"]}>
{results.map(item =>(
  <a className={styles["result-items"]} key={item.id} href={item.previewURL}>
<h6 className={styles["image-userName"]}>User: {item.user}</h6>
<div className={styles["image-wrapper"]}>
  <img className={styles.img} src={item.previewURL} alt={item.previewURL}/>
</div>
<div className={styles["info-wrapper"]}>
<p>Views: {item.views}</p>
<p>Favorites: {item.favorites}</p>
<p>Likes: {item.likes}</p>
<p>Comments: {item.comments}</p>
<p>Downloads: {item.downloads}</p>
</div>
  </a>

) )}

  </div>
  );
}

}




  render(){
const {query, isLoading, message, currentPageNum, totalPageCounts,pageNumber } = this.state

const showPrevPage = pageNumber < currentPageNum;
   const showNextpage = totalPageCounts > currentPageNum;
    return(
    <div className={styles.App}>
     
      <h1 className={styles.title}>React: Live Search Application </h1>
      <label className={styles.label} htmfor="search">
        <input className={styles.real}  onChange={this.handleChange} id="search" type="text" name="query" 
        value={query} placeholder="Enter your search..."/>
     <IosSearch className={styles.icon} name="search-outline"/>
     </label>
     {message && <p className="message">{message}</p>}
     <img src={Loader} className={`${styles.loading} ${isLoading? styles['show']: styles['hide']}`} alt="loader"/>
     <PageNavigation isLoading={isLoading}
       showPrevPage={showPrevPage}
       showNextpage={showNextpage}
      />
       {this.renderSearchResult()}
      <PageNavigation 
      showPrevPage={showPrevPage}
      showNextpage={showNextpage}
      isLoading={isLoading}
      />
    </div>
  );

  }
}

export default App;

{/* handlePrevPage={ () => this.handlePageClick('prev', event) }
  handleNextPage={ () => this.handlePageClick('next', event) }*/} 
{/* handlePrevPage={ () => this.handlePageClick('prev', event) }
    handleNextPage={ () => this.handlePageClick('next', event) }*/}