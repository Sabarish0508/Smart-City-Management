const API_BASE_URL = '/api';

/**
 * Helper to get the stored JWT token
 */
export const getToken = () => localStorage.getItem('smart_civic_token');

export const setToken = (token) => {
  if (token) {
    localStorage.setItem('smart_civic_token', token);
  } else {
    localStorage.removeItem('smart_civic_token');
  }
};

export const getUser = () => {
  const userJson = localStorage.getItem('smart_civic_user');
  try {
    return userJson ? JSON.parse(userJson) : null;
  } catch (e) {
    return null;
  }
};

export const setUser = (user) => {
  if (user) {
    localStorage.setItem('smart_civic_user', JSON.stringify(user));
  } else {
    localStorage.removeItem('smart_civic_user');
  }
};

/**
 * Unified fetch request wrapper with auto-auth and error parsing
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint}`;
  const token = getToken();

  const headers = {
    ...options.headers,
  };

  // If not FormData, set Content-Type to JSON
  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    });

    if (response.status === 204) {
      return null;
    }

    const contentType = response.headers.get('content-type');
    let data;
    if (contentType && contentType.includes('application/json')) {
      data = await response.json();
    } else {
      data = await response.text();
    }

    if (!response.ok) {
      const errorMessage =
        (data && data.message) ||
        (data && data.error) ||
        (typeof data === 'string' && data ? data : `Request failed with status ${response.status}`);
      const error = new Error(errorMessage);
      error.status = response.status;
      error.data = data;
      throw error;
    }

    return data;
  } catch (error) {
    if (error.name === 'TypeError' && error.message.includes('fetch')) {
      throw new Error('Unable to connect to Smart Civic backend (http://localhost:8080). Please ensure the backend server is running.');
    }
    throw error;
  }
}

// 1. Authentication APIs
export const authAPI = {
  login: (email, password) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    }),

  loginOfficial: (email, password, role) =>
    request('/auth/official-login', {
      method: 'POST',
      body: JSON.stringify({ email, password, role }),
    }),

  registerCitizen: (citizenData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(citizenData),
    }),

  registerOfficial: (officialData) =>
    request('/auth/register-official', {
      method: 'POST',
      body: JSON.stringify(officialData),
    }),

  getCurrentUser: () => request('/auth/me'),

  updateProfile: (profileData) =>
    request('/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    }),
};

// 2. Complaint APIs
export const complaintsAPI = {
  create: (complaintData) =>
    request('/complaints', {
      method: 'POST',
      body: JSON.stringify(complaintData),
    }),

  getAll: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.priority) searchParams.append('priority', params.priority);
    if (params.departmentId) searchParams.append('departmentId', params.departmentId);
    if (params.categoryId) searchParams.append('categoryId', params.categoryId);
    if (params.officerId) searchParams.append('officerId', params.officerId);
    if (params.search) searchParams.append('search', params.search);

    const qs = searchParams.toString();
    return request(`/complaints${qs ? `?${qs}` : ''}`);
  },

  getMyComplaints: (params = {}) => {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.append('status', params.status);
    if (params.search) searchParams.append('search', params.search);
    const qs = searchParams.toString();
    return request(`/complaints/my${qs ? `?${qs}` : ''}`);
  },

  getOfficerAssigned: () => request('/complaints/officer/assigned'),
  getMyAssignedComplaints: () => request('/complaints/officer/assigned'),
  getOfficerDepartmentQueue: () => request('/complaints/officer/department'),

  getDepartmentComplaints: (deptId) => request(`/complaints/department/${deptId}`),
  getByDepartment: (deptId) => request(`/complaints/department/${deptId}`),
  getMyDepartmentComplaints: () => request('/complaints/department/my'),

  getById: (id) => request(`/complaints/${id}`),

  track: (complaintNumber) => request(`/complaints/track/${encodeURIComponent(complaintNumber)}`),
  trackByNumber: (complaintNumber) => request(`/complaints/track/${encodeURIComponent(complaintNumber)}`),

  getTimeline: (id) => request(`/complaints/${id}/timeline`),

  updateStatus: (id, statusData) =>
    request(`/complaints/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(statusData),
    }),

  assignOfficer: (id, assignData) =>
    request(`/complaints/${id}/assign`, {
      method: 'PUT',
      body: JSON.stringify(assignData),
    }),

  getPublicStats: () => request('/complaints/public-stats'),
};

// 3. AI Civic Engine APIs
export const aiAPI = {
  analyzeIssue: (data) =>
    request('/ai/analyze', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 4. Analytics APIs
export const analyticsAPI = {
  getDashboardStats: () => request('/analytics/dashboard'),
  getDepartmentStats: (deptId) => request(`/analytics/department/${deptId}`),
  getMyDepartmentStats: () => request('/analytics/department/my'),
  getMapLocations: () => request('/analytics/map-data'),
  getDepartmentMapLocations: (deptId) => request(`/analytics/department/${deptId}/map-data`),
};

// 5. Department APIs
export const departmentsAPI = {
  getPublic: () => request('/departments/public'),
  getAll: () => request('/departments'),
  getStats: () => request('/departments/stats'),
  getById: (id) => request(`/departments/${id}`),
  create: (data) =>
    request('/departments', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  update: (id, data) =>
    request(`/departments/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    }),
  delete: (id) =>
    request(`/departments/${id}`, {
      method: 'DELETE',
    }),
};

// 6. Officer APIs
export const officersAPI = {
  getAll: (departmentId = null) =>
    request(`/officers${departmentId ? `?departmentId=${departmentId}` : ''}`),
  getAllOfficials: () => request('/officers/officials'),
  getWorkload: (departmentId = null) =>
    request(`/officers/workload${departmentId ? `?departmentId=${departmentId}` : ''}`),
  create: (data) =>
    request('/officers/create', {
      method: 'POST',
      body: JSON.stringify(data),
    }),
};

// 7. Category APIs
export const categoriesAPI = {
  getAll: () => request('/categories'),
};

// 8. Feedback APIs
export const feedbackAPI = {
  submit: (complaintId, data) =>
    request(`/feedback/complaint/${complaintId}`, {
      method: 'POST',
      body: JSON.stringify(data),
    }),
  getByComplaintId: (complaintId) => request(`/feedback/complaint/${complaintId}`),
  getByDepartment: (deptId) => request(`/feedback/department/${deptId}`),
  getByOfficer: (officerId) => request(`/feedback/officer/${officerId}`),
  getAll: () => request('/feedback'),
  getStats: () => request('/feedback/stats'),
};

// 9. Notification APIs
export const notificationsAPI = {
  getMy: () => request('/notifications'),
  getRecent: () => request('/notifications/recent'),
  getUnreadCount: () => request('/notifications/unread-count'),
  markAsRead: (id) =>
    request(`/notifications/${id}/read`, {
      method: 'PUT',
    }),
  markAllAsRead: () =>
    request('/notifications/read-all', {
      method: 'PUT',
    }),
};

// 10. File Upload API
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('file', file);
    return request('/uploads/image', {
      method: 'POST',
      body: formData,
    });
  },
};
