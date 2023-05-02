/**
   * checkConsortiumAffiliations
   * package.json::stripes.links.userDropdown[0] event handler
   *
   * Returning true means the userDropdown should include a "Switch active affiliation"
   * entry that, when clicked, will fire a "CHANGE_ACTIVE_AFFILIATION" event.
   *
   * Returning false means no entries will be added to the userDropdown.
   *
   * @param {object} stripes
   * @returns {boolean} true to show a "switch service points" menu item
   */
export const checkConsortiumAffiliations = (stripes) => {
  if (!stripes.hasInterface('consortia')) return false;

  return true;
};
