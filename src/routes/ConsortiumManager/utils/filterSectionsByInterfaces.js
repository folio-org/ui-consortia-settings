export const filterSectionsByInterfaces = (stripes, settings) => {
  return settings.reduce((acc, section) => {
    const filteredPages = section.pages.reduce((pagesAcc, { _interfaces, ...page }) => {
      if (!_interfaces?.length || _interfaces?.every(interfaceName => stripes.hasInterface(interfaceName))) {
        pagesAcc.push(page);
      }

      return pagesAcc;
    }, []);

    if (filteredPages.length > 0) {
      acc.push({
        ...section,
        pages: filteredPages,
      });
    }

    return acc;
  }, []);
};
