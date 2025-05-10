const StatusFilter = ({ status, onFilterChange }) => {
  const statuses = [
    { id: 'all', label: '全部', icon: '' },
    { id: 'approved', label: '已通过', icon: 'fa-check' },
    { id: 'rejected', label: '未通过', icon: 'fa-times' },
    { id: 'pending', label: '待审核', icon: 'fa-clock' }
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {statuses.map(item => (
        <button
          key={item.id}
          className={`status-filter ${
            status === item.id ? 'filter-active' : 
            item.id === 'all' ? 'bg-neutral-200 text-neutral-600' : 
            item.id === 'approved' ? 'bg-success/10 text-success' : 
            item.id === 'rejected' ? 'bg-warning/10 text-warning' : 
            'bg-neutral-200 text-neutral-600'
          } px-4 py-2 rounded-lg text-sm font-medium transition-custom hover:bg-neutral-200`}
          onClick={() => onFilterChange(item.id)}
        >
          {item.icon && <i className={`fa-solid ${item.icon} mr-1`}></i>}
          {item.label}
        </button>
      ))}
    </div>
  );
};

export default StatusFilter;    