
with open(r'c:\Users\raul_\OneDrive - Academico - Secretaria do Estado da Educação de São Paulo\Área de Trabalho\Armarinhos\package.json', 'rb') as f:
    content = f.read()
    print(f"Total size: {len(content)}")
    if len(content) >= 300:
        print(f"Around 293: {content[280:310]}")
        for i in range(280, 310):
            print(f"Pos {i}: {content[i:i+1]} ({content[i]})")
