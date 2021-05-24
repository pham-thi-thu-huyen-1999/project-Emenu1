import React, { Component } from 'react';
import ReactPaginate from 'react-paginate';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { get } from 'store';

class Paginate extends Component {

  previousLink = <FontAwesomeIcon icon={faAngleLeft} />
  nextLink = <FontAwesomeIcon icon={faAngleRight} />

  constructor(props) {
    super(props)
    this.state = {
      forcePage: 0,
      init: false
    }
  }

  onPageChange = (data) => {
    if (this.state.init) {
      this.setState({
        init: false
      })
    } else {
      this.props.onChange(data)
    }
  }

  static getDerivedStateFromProps(nextProps, prevState){
    if (nextProps.forcePage !== prevState.forcePage - 1 || nextProps.forcePage !== null) {
      return {
        forcePage: nextProps.forcePage - 1
      }
    }
    return null
 }

  render() {
    const {
      pageCount,
      marginPagesDisplayed,
      initialPage,
      pageRangeDisplayed
    } = this.props

    const { forcePage } = this.state

    return (
      <>{
        pageCount > 0 &&
        (
          <ReactPaginate
            pageClassName="emenu-pagination-list"
            pageLinkClassName="emenu-pagination-link"
            containerClassName="emenu-paginagion"
            previousClassName="emenu-pagination-previous"
            nextClassName="emenu-pagination-next"
            nextLinkClassName="emenu-pagination-next-link"
            previousLinkClassName="emenu-pagination-previous-link"
            breakClassName="emenu-pagination-break"
            breakLinkClassName="emenu-pagination-break-link"
            nextLabel={this.nextLink}
            previousLabel={this.previousLink}
            pageCount={pageCount}
            forcePage={forcePage}
            initialPage={initialPage}
            onPageChange={this.onPageChange}
            pageRangeDisplayed={pageRangeDisplayed}
            marginPagesDisplayed={marginPagesDisplayed}
          />
        )
      }
      </>
    )
  }
}

Paginate.defaultProps = {
  initialPage: 0,
  pageCount: 0,
  forcePage: 0,
  pageRangeDisplayed: 1,
  marginPagesDisplayed: 2,
  onChange: (data) => {
    console.log(data)
  }
};

export default Paginate;