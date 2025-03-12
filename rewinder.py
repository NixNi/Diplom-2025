import os

def traverse_directory(path, result_file):
    with open(result_file, 'w', encoding='utf-8') as result:
        _traverse_directory(path, result)

def _traverse_directory(path, result):
    for root, dirs, files in os.walk(path):
        for file in files:
            full_path = os.path.join(root, file)
            with open(full_path, 'r', encoding='utf-8') as current_file:
                content = current_file.read()
                result.write(f"Содержимое файла {file} представлено следующим кодом:\n{content}\n\n")

# Example usage:
directory_path = './backend/src'
result_file_path = 'result.txt'

traverse_directory(directory_path, result_file_path)
