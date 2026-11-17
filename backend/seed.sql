-- 1. Kategooriad
insert into categories (name) values
            ('Autod'),
            ('Kosmos'),
            ('Loomad'),
            ('Muinasjutt')
on conflict (name) do nothing;

-- 2. Värvimislehed
insert into coloring_pages (category_id, title, file_path)
select c.id, p.title, p.file_path
from (values
    ('Autod',      'Mäed',            'Autod/a1_maed.png'),
    ('Autod',      'Matkabuss',       'Autod/a2_matkabuss.png'),
    ('Autod',      'Maastur',         'Autod/a3_maastur.png'),
    ('Autod',      'Veoauto',         'Autod/a4_veoauto.png'),
    ('Autod',      'Vormel',          'Autod/a5_vormel.png'),
    ('Kosmos',     'Astronaut',       'Kosmos/k1_astronaut.png'),
    ('Kosmos',     'Ufo',             'Kosmos/k2_ufo.png'),
    ('Kosmos',     'Päikesesüsteem',  'Kosmos/k3_paikesesusteem.png'),
    ('Kosmos',     'Kuukulgur',       'Kosmos/k4_kuukulgur.png'),
    ('Kosmos',     'Maa satelliit',   'Kosmos/k5_maa_satelliit.png'),
    ('Loomad',     'Lehm',            'Loomad/t1_lehm.png'),
    ('Loomad',     'Siga',            'Loomad/t2_siga.png'),
    ('Loomad',     'Kana',            'Loomad/t3_kana.png'),
    ('Loomad',     'Lammas',          'Loomad/t4_lammas.png'),
    ('Loomad',     'Hobune',          'Loomad/t5_hobune.png'),
    ('Muinasjutt', 'Loss',            'Muinasjutt/m1_loss.png'),
    ('Muinasjutt', 'Draakon',         'Muinasjutt/m2_draakon.png'),
    ('Muinasjutt', 'Ükssarvik',       'Muinasjutt/m3_ukssarvik.png'),
    ('Muinasjutt', 'Seenemaja',       'Muinasjutt/m4_seenemaja.png'),
    ('Muinasjutt', 'Piparkoogimaja',  'Muinasjutt/m5_piparkoogimaja.png')
) as p(category, title, file_path)
join categories c on c.name = p.category
on conflict (file_path) do nothing;
