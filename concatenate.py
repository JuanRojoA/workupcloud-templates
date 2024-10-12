import os

def concatenate_files(input_folder, output_file):
  """
  Recursively reads files from a folder and concatenates them into a single output file.

  Args:
    input_folder: The path to the folder containing the files to concatenate.
    output_file: The path to the output .txt file.
  """
  with open(output_file, 'w') as outfile:
    for dirpath, dirnames, filenames in os.walk(input_folder):
      for filename in filenames:
        filepath = os.path.join(dirpath, filename)
        outfile.write(f"// {filename}\n\n")
        with open(filepath, 'r') as infile:
          outfile.write(infile.read())
          outfile.write("\n\n")

if __name__ == "__main__":
  input_folder = input("Enter the input folder path: ")
  output_file = input("Enter the output file path: ")
  concatenate_files(input_folder, output_file)
  print(f"Files concatenated successfully to {output_file}")