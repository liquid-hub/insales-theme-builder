 # Сборщик шаблонов на платформе InSales

 - Возможность переноса компонентов между проектами

 - Подключение плагинов/шрифтов простым переносом файлов в папку

 - Удобная работа с scss переменными

 - Встроенный insales-uploader


 ## Установка

 ```
 npm i itb -g
 ```

 > Для Mac и Linux не забывайте подставлять *sudo*

 ## Инициализация

 В папке для проекта нужно выполнить команду

 ```
 itb init
 ```

 После данной команды будет создан файл настроек, в котором нужно указать настройки для [InSales uploader](https://github.com/insales/insales-uploader)


 ## Команды

 Для справки доступных команд, введите в консоли `itb -h`.

 | Имя команды   | Назначение                                       |
 |--------------|--------------------------------------------------|
 | init или i |  Инициализировать проект |
 | build или b      | Собрать тему |
 | watch или w      | Отслеживание изменений |
 | setup или s | Установить базовый проект |
 | create [components...]  | Создать компоненты   |
 | push или p| Отправить тему на сервер |

 Например

 ```
 itb create logotype
 ```

 ```
 itb b
 ```

 ```
 itb w
 ```

 > Для пользователей MacOs может потребоваться `sudo`

 ```
 sudo itb b
 ```

 ```
 sudo itb w
 ```

 ## Назначение директорий

 | Имя директории | Назначение                                    |
 |----------------|-----------------------------------------------|
 | `components`     | Компоненеты которые будут включаться в шаблон |
 | `components/*/*.scss` | Стили которые собираются в theme.scss                                |
 | `components/*/ui.scss` | Стили которые собираются в ui.scss                                |
 | `components/*/plugins/*/*` | Js/css плагины                                |
 | `components/*/media` | медиа для компонентов                                |
 | `components/*/setup.json` | setup.json для компонента                                |
 | `scss_import/variables`    | Переменные для scss                           |
 | `templates`      | Шаблоны                                       |
 | `fonts`         | Шрифты                                        |
 | `media`          | Медиа файлы для шаблона                       |
 | `config`         | Конфиги для темы                              |
 | `theme`          | Директория темы                               |
 | `bundles`        | Бандлы (css/js), содержимое директорий конкатенируется                              |

 ## Шрифты

 Для генерации шрифтов с готовым файлом стилей хорошо подходит ресурс [transfonter](https://transfonter.org/).
