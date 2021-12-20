/*
 * SETTINGS
 */

const settings = {
  studentList: document.querySelector('.student-list'),
  paginationList: document.querySelector('.link-list'),
  studentData: data,
  studentsPerPage: 9,
  currentPage: 1,
  get totalPages() {
    return Math.ceil(this.studentData.length / this.studentsPerPage);
  }
};

/*
 * PAGINATION FUNCTIONS
 */

const addPagination = (page = settings.currentPage) => {
  for (let i = 1; i <= settings.totalPages; i++) {
    const li = `<li><button type='button'${i === page ? 'disabled class="active"' : ''}>${i}</button></li>`;
    settings.paginationList.insertAdjacentHTML('beforeend', li);
  }
};

/*
 * DATA FUNCTIONS
 */

const resetPresentation = () => {
  settings.studentList.innerHTML = '';
  settings.paginationList.innerHTML = '';
  document.querySelector('.no-results')?.remove();
};

const showNoDataMessage = () => {
  const paginationList = document.querySelector('.pagination');
  paginationList.insertAdjacentHTML('beforeBegin', '<p class="no-results">No results</p>');
};

const makeStudentCard = student => {
  const studentCard = document.createElement('li');
  studentCard.classList.add('student-item');
  studentCard.innerHTML = `
  <div class="student-details">
    <img class="avatar" src="${student.picture.medium}" alt="Profile Picture">
    <h3>${student.name.first} ${student.name.last}</h3>
    <span class="email">${student.email}</span>
  </div>
  <div class="joined-details">
    <span class="date">Joined ${student.registered.date}</span>
  </div>`;
  return studentCard;
};

const showStudents = slicedData => {
  slicedData.forEach(student => settings.studentList.appendChild(makeStudentCard(student)));
  addPagination();
};

const getSlicedData = list => {
  const sliceStart = (settings.currentPage - 1) * settings.studentsPerPage;
  const sliceEnd = settings.currentPage * settings.studentsPerPage;
  return list.slice(sliceStart, sliceEnd);
};

const presentData = () => {
  resetPresentation();
  const slicedData = getSlicedData(settings.studentData);
  slicedData.length === 0 ? showNoDataMessage() : showStudents(slicedData);
};

/*
 * SEARCH FUNCTIONS
 */

const searchTheData = searchTerm => {
  settings.studentData = data.filter((student) => {
    return student.name.first.toLowerCase().includes(searchTerm) || student.name.last.toLowerCase().includes(searchTerm);
  });
  settings.currentPage = 1;
  presentData();
};

const addSearchElement = () => {
  const pageHeader = document.querySelector('.header');

  // Label element
  const searchLabel = document.createElement('label');
  searchLabel.classList.add('student-search');
  searchLabel.setAttribute('for', 'search');

  // Span element
  const searchSpan = document.createElement('span');
  searchSpan.innerHTML = 'Search by name';

  // Input element
  const searchInput = document.createElement('input');
  searchInput.setAttribute('type', 'text');
  searchInput.setAttribute('id', 'search');
  searchInput.setAttribute('placeholder', 'Search by name...');
  searchInput.setAttribute('aria-label', 'Search by name');

  // Button element
  const searchButton = document.createElement('button');
  searchButton.setAttribute('type', 'button');
  searchButton.setAttribute('aria-label', 'Search');
  searchButton.innerHTML = '<img src="img/icn-search.svg" alt="Search icon" width="25" height="26">';

  // Append elements
  searchLabel.append(searchSpan, searchInput, searchButton);
  pageHeader.appendChild(searchLabel);

  searchButton.addEventListener('click', () => {
    searchTheData(searchInput.value.toLowerCase());
  });
};

/*
 * PAGINATION EVENT LISTENER
 */

document.addEventListener('click', ev => {
  if (ev.target.tagName === 'BUTTON' && ev.target.parentElement.parentElement.classList.contains('link-list')) {
    settings.currentPage = parseInt(ev.target.textContent, 10);
    presentData();
  }
});

addSearchElement();
presentData();
