# API

Подробные **аннотации** к каждому _эндпоинту_ в виде таблицы

| Эндпоинт                      | Метод      | DTO                                                                                                               | Описание                                                |
| ----------------------------- | ---------- | ----------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| `auth/new-tokens`             | **POST**   | _refreshToken_: **string**                                                                                        | Обновление пары токенов                                 |
| `auth/sign-in`                | **POST**   | _email_: **string**<br>_password_: **string**                                                                     | Вход в существующий аккаунт                             |
| `auth/sign-up`                | **POST**   | _email_: **string**<br>_password_: **string**<br>_name_: **string**<br>_role_: **STUDENT** \|\| **TEACHER**       | Регистрация нового аккаунта                             |
| `auth/verify`                 | **POST**   | _accessToken_: **string**                                                                                         | Верификация токена                                      |
| `users/profile`               | **GET**    | -                                                                                                                 | Получение профиля пользователя                          |
| `users/profile`               | **PUT**    | _email_: **string**<br>_password_?: **string**<br>_name_?: **string**                                             | Изменение профиля пользователя                          |
| `users/profile`               | **DELETE** | -                                                                                                                 | Удалить профиль пользователя                            |
| `classrooms/:classroomId`     | **GET**    | URL-параметр _classroomId_                                                                                        | Получение информации о классе по id                     |
| `classrooms/connect`          | **PATCH**  | _classroomCode_: **string**                                                                                       | Присоединиться к классу (ученик)                        |
| `classrooms/disconnect`       | **PATCH**  | _classroomId_: **string**                                                                                         | Выйти из класса (ученик)                                |
| `classrooms/create`           | **POST**   | _name_: **string**                                                                                                | Создать класс (учитель)                                 |
| `classrooms/delete`           | **DELETE** | _classroomId_: **string**                                                                                         | Удалить класс (учитель)                                 |
| `exercises/:exerciseId`       | **GET**    | URL-параметр _exerciseId_                                                                                         | Получить упражнение по id                               |
| `exercises/from/:classroomId` | **GET**    | URL-параметр _classroomId_                                                                                        | Получить список задач из определённого класса по его id |
| `exercises/uncompleted`       | **GET**    | -                                                                                                                 | Получить все невыполненные задачи (ученик)              |
| `exercises/complete`          | **PATCH**  | _exerciseId_: **string**<br>_userAnswer_: **string**                                                              | Отправить ответ на задачу (ученик)                      |
| `exercises/new`               | **POST**   | _classroomId_: **string**<br>_problem_: **string**<br>_answer_: **string**<br>_available_?: **string** (**date**) | Создать задачу (учитель)                                |
| `exercises/delete`            | **DELETE** | _exerciseId_: **string**                                                                                          | Удалить задачу (учитель)                                |
