import noop from 'lodash/noop';
import PropTypes from 'prop-types';
import { useCallback, useMemo } from 'react';
import { FormattedMessage } from 'react-intl';

import {
  Button,
  Checkbox,
  Layout,
  MessageBanner,
  Modal,
  Paneset,
} from '@folio/stripes/components';
import {
  FiltersPane,
  FrontendSortingMCL,
  ResetButton,
  ResultsPane,
  SEARCH_PARAMETER,
  SingleSearchForm,
  useFilters,
  useToggle,
} from '@folio/stripes-acq-components';

import {
  MEMBERS_COLUMN_NAMES,
  MEMBERS_COLUMN_WIDTHS,
  MEMBERS_VISIBLE_COLUMNS,
} from '../constants';

import css from '../FindConsortiumMember.css';
import { useRecordsSelect } from '../useRecordsSelect';

const getColumnMapping = ({ isAllSelected, selectAll }) => ({
  selected: (
    <FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.modal.aria.selectAll">
      {label => (
        <Checkbox
          aria-label={label}
          checked={isAllSelected}
          onChange={selectAll}
        />
      )}
    </FormattedMessage>
  ),
  name: <FormattedMessage id="ui-consortia-settings.settings.membership.list.tenantName" />,
});

const getResultFormatter = ({ select, selectedRecordsMap }) => ({
  selected: member => (
    <FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.modal.aria.select">
      {label => (
        <Checkbox
          aria-label={label}
          checked={Boolean(selectedRecordsMap[member.id])}
          onChange={() => select(member)}
        />
      )}
    </FormattedMessage>
  ),
  name: member => member.name,
});

const sorters = {
  [MEMBERS_COLUMN_NAMES.name]: ({ name }) => name.toLocaleLowerCase(),
};

export const FindConsortiumMemberModal = ({
  initialSelected,
  onClose,
  onSave,
  records,
  resetData,
}) => {
  const [isFiltersVisible, toggleFilters] = useToggle(true);

  const {
    filters,
    searchQuery,
    applyFilters,
    applySearch,
    changeSearch,
    resetFilters,
  } = useFilters(resetData);

  const {
    isAllSelected,
    select,
    selectAll,
    selectedRecordsMap,
    totalSelected,
  } = useRecordsSelect({ records, initialSelected });

  const handleSave = useCallback(() => {
    onSave(records.filter(({ id }) => selectedRecordsMap[id]));
  }, [onSave, records, selectedRecordsMap]);

  const footer = (
    <Layout className="display-flex justified full">
      <Button
        id="clickable-find-consortium-member-modal-cancel"
        onClick={onClose}
        marginBottom0
      >
        <FormattedMessage id="stripes-core.button.cancel" />
      </Button>
      <div>
        <FormattedMessage
          id="ui-consortia-settings.consortiumManager.findMember.modal.results.totalSelected"
          values={{ amount: totalSelected }}
        />
      </div>
      <Button
        id="clickable-find-consortium-member-modal-submit"
        marginBottom0
        buttonStyle="primary"
        onClick={handleSave}
      >
        <FormattedMessage id="stripes-components.saveAndClose" />
      </Button>
    </Layout>
  );

  const columnMapping = useMemo(() => getColumnMapping({ isAllSelected, selectAll }), [isAllSelected, selectAll]);
  const formatter = useMemo(() => getResultFormatter({ select, selectedRecordsMap }), [select, selectedRecordsMap]);

  const query = filters[SEARCH_PARAMETER];
  const contentData = useMemo(() => (
    records.filter(({ name }) => (
      query ? name.toLowerCase().includes(query.toLowerCase()) : true
    ))
  ), [query, records]);

  const onChangeSearch = useCallback((e) => {
    changeSearch(e);
    if (!e.target.value) {
      applyFilters([SEARCH_PARAMETER], undefined);
    }
  }, [applyFilters, changeSearch]);

  return (
    <Modal
      open
      id="find-consortium-member-modal"
      contentClass={css.modalContent}
      dismissible
      footer={footer}
      label={<FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.trigger.label" />}
      onClose={onClose}
      size="large"
      showHeader
    >
      <Paneset isRoot static>
        {isFiltersVisible && (
          <FiltersPane
            id="find-consortium-member-filters-pane"
            toggleFilters={toggleFilters}
          >
            <SingleSearchForm
              applySearch={applySearch}
              changeSearch={onChangeSearch}
              searchQuery={searchQuery}
              ariaLabelId="ui-consortia-settings.consortiumManager.findMember.modal.aria.search"
            />

            <ResetButton
              reset={resetFilters}
              disabled={!searchQuery}
            />
          </FiltersPane>
        )}

        <ResultsPane
          title={<FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.modal.results.title" />}
          subTitle={(
            <FormattedMessage
              id="ui-consortia-settings.consortiumManager.findMember.modal.results.subTitle"
              values={{ amount: contentData.length }}
            />
          )}
          count={contentData.length}
          toggleFiltersPane={toggleFilters}
          filters={filters}
          isFiltersOpened={isFiltersVisible}
        >
          <MessageBanner type="warning">
            <FormattedMessage id="ui-consortia-settings.consortiumManager.findMember.modal.results.warning" />
          </MessageBanner>
          <FrontendSortingMCL
            id="find-consortium-member-list"
            columnIdPrefix="consortium-manager"
            columnMapping={columnMapping}
            contentData={contentData}
            columnWidths={MEMBERS_COLUMN_WIDTHS}
            formatter={formatter}
            sortedColumn={MEMBERS_COLUMN_NAMES.name}
            sorters={sorters}
            visibleColumns={MEMBERS_VISIBLE_COLUMNS}
          />
        </ResultsPane>
      </Paneset>
    </Modal>
  );
};

FindConsortiumMemberModal.defaultProps = {
  initialSelected: [],
  records: [],
  resetData: noop,
};

const recordShape = PropTypes.shape({
  id: PropTypes.string,
  name: PropTypes.string,
});

FindConsortiumMemberModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  records: PropTypes.arrayOf(recordShape),
  resetData: PropTypes.func,
  initialSelected: PropTypes.arrayOf(recordShape),
};
