getPagingData(list, page, limit, totalcount) {
    const total = totalcount;
    const currentPage = page ? +page : 1;
    const totalPages = Math.ceil(total / limit);
    const pageMeta = {};
    pageMeta.size = limit;
    pageMeta.page = currentPage;
    pageMeta.total = total;
    pageMeta.totalPages = totalPages;
    pageMeta.pageCount = totalPages;
    return {
      pageMeta,
      list
    };
  }

  getPagingData(getRoles, page, limit, countDoc)