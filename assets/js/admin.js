
(function () {

    // __________________________________________adds responsiveness to admin side menu bar_________________ 
    function adminPageSideNavigation() {

        let toggle = document.querySelector('.toggle');
        let navigation = document.querySelector('.navigation');
        let showNavBar = false;

        toggle.onclick = () => {

            showNavBar = !showNavBar;
            if (showNavBar) {
                navigation.style.display = 'inline-block';
            } else {
                navigation.style.display = 'none';
            }
        }
    }

    //__________________________________________provides load more functionality_________________________________
    function loadMore() {

        let loadMoreBtn = document.querySelector('.custom-btn');
        let currentItem = 4; //current visible items

        loadMoreBtn.onclick = () => {// makes 4 more items visible
            let boxes = [...document.querySelectorAll('.employee-box')];
            for (var i = currentItem; i < currentItem + 4 && i < boxes.length; i++) {
                boxes[i].style.display = 'flex';
            };
            currentItem += 4;
            if (currentItem >= boxes.length) {// if all items are shown hides loadmore button
                loadMoreBtn.style.display = 'none';
            }
        }
    }


    //_____________________________________checking gender radio input based on employee gender_______________________________________ 
    //sets checked attribute in gender radio input of an employee based on gender
    function setGender(empGenderContainer) {
        let gender = empGenderContainer.getAttribute('data-employeeGender');
        let setGender = empGenderContainer.getElementsByTagName('input')
        let labels = empGenderContainer.getElementsByTagName('label');

        if (gender == 'Male') {
            setGender[0].setAttribute('checked', true);
            labels[0].classList.remove('opacity');
            labels[1].classList.add('opacity');


        } else {
            setGender[1].setAttribute('checked', true);
            labels[1].classList.remove('opacity');
            labels[0].classList.add('opacity');
        }
    }

    // iterates on each employee gender container
    function setEmployeeGendersInDOM() {

        let empGenderContainers = document.querySelectorAll('.emp-gender');

        for (let empGenderContainer of empGenderContainers) {
            setGender(empGenderContainer);
        }
    }



    //_________________________showNotification : used to show response message of ajax req as notification ___________________________
    function showNotification(type, message) {
        new Noty({
            theme: 'relax',
            text: message,
            type: type,
            layout: 'topRight',
            timeout: 1500

        }).show();
    }


    //____________________________ adding new Employee : sending ajax req and adding new employee in dom______________________________
    // creates newEmployee element
    function newEmployeeDOM(employee) {
        return $(`<div id="employee-box-${employee.id}"class="employee-box">
            <div class="image">
                <img src='./img/male.png' alt="" class="emp-img">
            </div>

            <div class="content-box">

                <form action="/admin/update-employee/${employee.id}" method="POST" id="employee-${employee.id}">
                    <div>
                        <div class="emp-name">
                            <label for="name">Name : </label>
                            <input type="text" name="name" value="${employee.name}" disabled required>
                        </div>

                        <div class="emp-email">
                            <label for="name">Email : </label>
                            <input type="email" name="email" value="${employee.email}" disabled required>
                        </div>

                        <div class="emp-gender" data-employeeGender="${employee.gender}">

                            <span>Gender : </span>

                            <input class="radio" type="radio" name="gender" id="male-${employee.id}"
                                value="Male" disabled required>
                            <label for="male-${employee.id}"> Male</label>
                            <input class="radio" type="radio" name="gender" id="female-${employee.id}"
                                value="Female" required disabled>
                            <label for="female-${employee.id}"> Female</label>
                        </div>

                        <div class="make-admin">
                            <input type="checkbox" id="emp-${employee.id}" name="access" disabled
                                value="admin">
                            <label for="emp-${employee.id}"> admin</label><br>
                        </div>

                    </div>

                    <div class="buttons">

                        <span class="update-employee-btn">
                            <a data-empId=${employee.id}> <i class="fa-solid fa-pen"></i> </a>
                        </span>

                        <span id="remove-employee"><a data-removeEmployee="true"
                                href="/admin/remove-employee/${employee.id}"> <i class="fa-solid fa-trash"></i>
                            </a></span>

                        <button class="save-changes" type="submit">
                            save

                        </button>

                    </div>

                    <a style="display:inline-block" href="/admin/emp-reviews/${employee.id}"
                        class="btn review-btn">
                        <!-- <i class="fa-regular fa-eye"></i> -->
                        <i class="fa-solid fa-eye"></i>
                        See Reviews
                    </a>
                </form>
            </div>
        </div>`)
    }

    // sends ajax req on form submission
    function onSubmitAddEmployeeForm() {

        $('#add-employee-form').on('submit', (e) => {

            e.preventDefault();

            $.ajax({               //ajax req
                type: 'post',
                url: $('#add-employee-form').attr('action'),
                data: $('#add-employee-form').serialize(),

                success: function (data) {

                    showNotification('success', data.message);

                    let newEmployee = newEmployeeDOM(data.data.employee);
                    $('.employee-details').prepend(newEmployee);

                    let newEmpEditBtn = $(newEmployee).find('.update-employee-btn a').get(0);
                    let newEmpUpdateForm = $(newEmployee).find('form');
                    let newEmpDeleteBtn = $(newEmployee).find('#remove-employee a');
                    let newEmpGenderContainer = $(newEmployee).find('.emp-gender').get(0);


                    editOption(newEmpEditBtn);        //enables edit option
                    updateEmployee(newEmpUpdateForm);  //  ajax updateEmployee form submission
                    deleteEmployee(newEmpDeleteBtn);    //deleteEmployee through ajax req
                    setGender(newEmpGenderContainer);  // marks gender of employee in dom  (checks correct radio button based on gender)

                    $('#add-employee-form').css('display', 'none');   // hides add-employee-form

                }, error: function (error) {

                    showNotification('error', error.responseJSON.message);   //shows error notification(ex:- 'email already registered!!!')
                }

            });

            $('#add-employee-form').each(function () {
                this.reset();   //resets input fields
            });
        })
    }

    //  ___________________________________adds toggle form feature on clicking Add Employee button_________________________________________
    function addEmployee() {

        let addEmployee = document.getElementById('add-employee-option');  //points to addEmployee button
        let displayForm = false;

        addEmployee.onclick = (e) => {   // toggles display of addEmployee form
            e.preventDefault();
            displayForm = !displayForm;

            let addEmployeeForm = document.getElementById('add-employee-form');

            if (displayForm) {
                addEmployeeForm.style.display = 'block';
            } else {
                addEmployeeForm.style.display = 'none';
            }
        }
    }

    //_______________________________________sends ajax req for assigning review___________________________________________________________________
    function assignReview() {

        $('#review-form').on('submit', (e) => {
            e.preventDefault();

            $.ajax({    //ajax req
                type: 'post',
                url: $('#review-form').attr('action'),
                data: $('#review-form').serialize(),

                success: function (data) {

                    showNotification('success', data.message);

                }, error: function (error) {

                    showNotification('error', error.responseJSON.message);
                }
            })

            $('#emp-email').val('');     //resets input fields
            $('#reviewer-email').val('');
        })
    }


    //_______________________________________sending ajax req for updating employee information______________________________________________
    // sends ajax req when a update employee form is submitted
    function updateEmployee(form) {

        $(form).on('submit', (e) => {
            e.preventDefault();

            $.ajax({   // ajax req
                type: 'put',
                url: $(form).attr('action'),
                data: $(form).serialize(),

                success: function (data) {
                    showNotification('success', data.message);

                }, error: function (error) {

                    showNotification('error', error.responseJSON.message);
                    $(form).find('input')[1].value = `${error.responseJSON.data.email}`  // if no changes are done because of error, replaces changed email input field with original email ... (error can only occur if trying to replace email, with email which is already registered with another user)
                }
            })

            let inputs = $(form).find('input');

            for (let input of inputs) {               // hiding save button and making input fields disabled
                input.disabled = true;
                input.style.outline = 'none';

                if (input.hasAttribute('class')) {

                    let labels = input.parentElement.querySelectorAll('label');
                    labels[0].classList.add('opacity');
                    labels[1].classList.add('opacity');
                }
            }
            $(form).find('.save-changes').css('display', 'none');
        });
    }



    //iterates over each update employee form and calls updateEmployee function
    function handleUpdateEmployeeForm() {

        let updateForms = $('#employees .employee-details form');

        for (let form of updateForms) {
            updateEmployee(form);
        }
    }


    // __________________ on clicking pen icon removes disabled attribute from input tags in update employee form and makes saves button visible____________________________
    function editOption(button) {
        button.onclick = (e) => {
            e.preventDefault();
            const empId = button.getAttribute('data-empId');

            const employeeForm = document.querySelector(`#employee-${empId}`);
            const inputs = employeeForm.querySelectorAll('input');

            for (let input of inputs) {
                input.removeAttribute('disabled');
                input.style.outline = 'auto';

                if (input.hasAttribute('class')) {
                    let labels = input.parentElement.querySelectorAll('label');
                    labels[0].classList.remove('opacity');
                    labels[1].classList.remove('opacity');
                }

            }
            const saveChangesButton = employeeForm.querySelector(`.save-changes`)
            saveChangesButton.style.display = 'inline-block';
        }
    }


    // adds editOption() in each update employee form
    function updateEmployeeFeature() {

        let updateEmployeeButtons = document.querySelectorAll('.update-employee-btn a');

        for (let button of updateEmployeeButtons) {
            editOption(button);
        }
        handleUpdateEmployeeForm();
    }



    //_________________________________________sending ajax delete req to delete employee___________________________________________
    function deleteEmployee(btn) {

        $(btn).click((e) => {
            e.preventDefault();

            $.ajax({   // ajax req
                type: 'delete',
                url: $(btn).attr('href'),

                success: function (data) {

                    new Noty({
                        theme: 'relax',
                        text: data.message,
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500

                    }).show();

                    let empId = $(btn).attr('href').slice(23);  // taking out empId from delete button href (url) attribute
                    $(`#employee-box-${empId}`).remove();   // removing deleted employee from dom
                },

                error: function (error) {
                    showNotification('error', error.responseJSON.message);
                }
            })
        })
    }


    //iterates over each delete button and calls deleteEmployee() function
    function handleDeleteEmployee() {

        let deleteButtons = $('#remove-employee a');

        for (let btn of deleteButtons) {
            deleteEmployee(btn);
        }
    }



    //_____________________________________________calling functions______________________________________________________

    adminPageSideNavigation();
    loadMore();
    setEmployeeGendersInDOM();  

    onSubmitAddEmployeeForm()

    addEmployee();  // handles toggling of add employee form on clicing add employee button

    assignReview();

    updateEmployeeFeature();
    handleDeleteEmployee();

})();