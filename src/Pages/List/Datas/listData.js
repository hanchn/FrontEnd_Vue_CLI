// 模拟列表数据
export const mockListData = {
  // 生成模拟数据
  generateData(count = 100) {
    const data = []
    const categories = ['type1', 'type2', 'type3']
    const statuses = ['active', 'inactive', 'pending']
    
    for (let i = 1; i <= count; i++) {
      data.push({
        id: i,
        name: `数据项 ${i}`,
        description: `这是第 ${i} 条数据的描述信息`,
        category: categories[Math.floor(Math.random() * categories.length)],
        status: statuses[Math.floor(Math.random() * statuses.length)],
        createTime: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        updateTime: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        views: Math.floor(Math.random() * 1000),
        score: (Math.random() * 5).toFixed(1)
      })
    }
    return data
  },

  // 获取筛选后的数据
  getFilteredData(filters, pagination) {
    let data = this.generateData()
    
    // 关键词筛选
    if (filters.keyword) {
      data = data.filter(item => 
        item.name.includes(filters.keyword) || 
        item.description.includes(filters.keyword)
      )
    }
    
    // 状态筛选
    if (filters.status) {
      data = data.filter(item => item.status === filters.status)
    }
    
    // 分类筛选
    if (filters.category) {
      data = data.filter(item => item.category === filters.category)
    }
    
    // 日期范围筛选
    if (filters.dateRange && filters.dateRange.length === 2) {
      const [startDate, endDate] = filters.dateRange
      data = data.filter(item => {
        const itemDate = new Date(item.createTime)
        return itemDate >= startDate && itemDate <= endDate
      })
    }
    
    const total = data.length
    const start = (pagination.current - 1) * pagination.pageSize
    const end = start + pagination.pageSize
    
    return {
      data: data.slice(start, end),
      total
    }
  }
}

// 表格列配置
export const tableColumns = [
  {
    title: 'ID',
    dataIndex: 'id',
    key: 'id',
    width: 80,
    sorter: true
  },
  {
    title: '名称',
    dataIndex: 'name',
    key: 'name',
    width: 150,
    ellipsis: true
  },
  {
    title: '描述',
    dataIndex: 'description',
    key: 'description',
    width: 200,
    ellipsis: true
  },
  {
    title: '分类',
    dataIndex: 'category',
    key: 'category',
    width: 100,
    filters: [
      { text: '类型一', value: 'type1' },
      { text: '类型二', value: 'type2' },
      { text: '类型三', value: 'type3' }
    ]
  },
  {
    title: '状态',
    dataIndex: 'status',
    key: 'status',
    width: 100,
    slots: { customRender: 'status' }
  },
  {
    title: '创建时间',
    dataIndex: 'createTime',
    key: 'createTime',
    width: 120,
    sorter: true
  },
  {
    title: '浏览量',
    dataIndex: 'views',
    key: 'views',
    width: 100,
    sorter: true
  },
  {
    title: '评分',
    dataIndex: 'score',
    key: 'score',
    width: 80,
    sorter: true
  },
  {
    title: '操作',
    key: 'action',
    width: 150,
    fixed: 'right',
    slots: { customRender: 'action' }
  }
]

// 筛选选项配置
export const filterOptions = {
  statusOptions: [
    { label: '启用', value: 'active' },
    { label: '禁用', value: 'inactive' },
    { label: '待审核', value: 'pending' }
  ],
  categoryOptions: [
    { label: '类型一', value: 'type1' },
    { label: '类型二', value: 'type2' },
    { label: '类型三', value: 'type3' }
  ]
}