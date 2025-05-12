import os

def traverse_directory(
    path, 
    result_file, 
    extensions=None, 
    exclude_dirs=None,
    encoding='utf-8'
):
    """
    Рекурсивно обходит директорию и сохраняет содержимое файлов в result_file.
    
    :param path: Путь к директории для обхода
    :param result_file: Файл для сохранения результатов
    :param extensions: Список разрешенных расширений файлов (например, ['.py', '.txt'])
    :param exclude_dirs: Список директорий для исключения (например, ['venv', '.git'])
    :param encoding: Кодировка файлов
    """
    if extensions is None:
        extensions = ['.txt', '.py', '.js', '.html', '.css']  # значения по умолчанию
    if exclude_dirs is None:
        exclude_dirs = ['.git', 'venv', '__pycache__', 'node_modules']  # значения по умолчанию
    
    with open(result_file, 'w', encoding=encoding) as result:
        _traverse_directory(path, result, extensions, exclude_dirs, encoding)

def _traverse_directory(path, result, extensions, exclude_dirs, encoding):
    for root, dirs, files in os.walk(path):
        # Пропускаем исключенные директории
        dirs[:] = [d for d in dirs if d not in exclude_dirs]
        
        for file in files:
            # Проверяем расширение файла
            if extensions and not any(file.endswith(ext) for ext in extensions):
                continue
                
            full_path = os.path.join(root, file)
            try:
                with open(full_path, 'r', encoding=encoding) as current_file:
                    content = current_file.read()
                    relative_path = os.path.relpath(full_path, path)
                    # result.write(f"Файл: {relative_path}\n")
                    result.write(f"Содержимое файла \"{relative_path}\" представлено следующим кодом:\n{content}\n\n")
                    # result.write("-" * 80 + "\n\n")
            except UnicodeDecodeError:
                print(f"Ошибка декодирования файла {full_path} - пропускаем")
            except PermissionError:
                print(f"Нет прав доступа к файлу {full_path} - пропускаем")
            except Exception as e:
                print(f"Ошибка при обработке файла {full_path}: {str(e)} - пропускаем")

# Пример использования:
if __name__ == "__main__":
    directory_path = './'
    result_file_path = 'result.txt'
    allowed_extensions = ['.js', '.jsx', '.ts', '.tsx', '.html', '.css']
    excluded_directories = ['node_modules', '.git', 'dist', 'build']

    traverse_directory(
        path=directory_path,
        result_file=result_file_path,
        extensions=allowed_extensions,
        exclude_dirs=excluded_directories,
        encoding='utf-8'
    )