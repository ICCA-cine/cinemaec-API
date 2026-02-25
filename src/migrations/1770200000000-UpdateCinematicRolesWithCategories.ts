import { MigrationInterface, QueryRunner } from 'typeorm'

export class UpdateCinematicRolesWithCategories1770200000000
  implements MigrationInterface
{
  name = 'UpdateCinematicRolesWithCategories1770200000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    // 1. Create role_categories table
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "role_categories" (
        "id" SERIAL PRIMARY KEY,
        "name" character varying(100) NOT NULL,
        "nameEn" character varying(100) NOT NULL
      )
    `)

    // 2. Insert role categories
    await queryRunner.query(`
      INSERT INTO "role_categories" ("id", "name", "nameEn") VALUES
      (1, 'Animación', 'Animation'),
      (2, 'Dept. de Fotografía - Cámara - Iluminación', 'Cinematography - Camera - Lighting Dept.'),
      (3, 'Departamento de Música y Sonido', 'Music and Sound Department'),
      (4, 'Dirección - Realización', 'Directing - Filmmaking'),
      (5, 'Dirección de Arte', 'Art Direction'),
      (6, 'Distribución', 'Distribution'),
      (7, 'Edición y Postproducción de Imagen', 'Image Editing and Post-production'),
      (8, 'Elenco', 'Cast / Talent'),
      (9, 'Exhibición', 'Exhibition'),
      (10, 'Formación', 'Education / Training'),
      (11, 'Gestión Cultural', 'Cultural Management'),
      (12, 'Guion', 'Screenwriting / Script'),
      (13, 'Televisión', 'Television'),
      (14, 'Producción', 'Production'),
      (15, 'Servicios Complementarios', 'Complementary Services'),
      (16, 'Videojuegos', 'Video Games'),
      (17, 'Otros Servicios', 'Other Services')
    `)

    // 3. Add new columns to cinematic_roles
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" 
      ADD COLUMN IF NOT EXISTS "idRoleCategory" integer,
      ADD COLUMN IF NOT EXISTS "nameEn" character varying(100)
    `)

    // 4. Drop the unique constraint on name if it exists
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" DROP CONSTRAINT IF EXISTS "UQ_cinematic_roles_name"
    `)

    // 5. Delete existing movie_professionals references (no data in production yet)
    await queryRunner.query(`DELETE FROM "movie_professionals"`)

    // 6. Delete all existing cinematic roles (old data)
    await queryRunner.query(`DELETE FROM "cinematic_roles"`)

    // 7. Insert all new cinematic roles
    // First, insert the critical roles with specific IDs for frontend compatibility
    await queryRunner.query(`
      INSERT INTO "cinematic_roles" ("id", "idRoleCategory", "name", "nameEn") VALUES
      (1, 4, 'Dirección', 'Director'),
      (2, 14, 'Producción', 'Producer'),
      (20, 8, 'Actuación (Actor / Actriz / Actore)', 'Actor / Actress / Performer')
    `)

    // Then insert all other roles
    await queryRunner.query(`
      INSERT INTO "cinematic_roles" ("idRoleCategory", "name", "nameEn") VALUES
      -- Animación (Category 1)
      (1, 'Especialista en Animación', 'Animator'),
      (1, 'Artista Conceptual', 'Concept Artist'),
      (1, 'Diseñador/a/e', 'Designer'),
      (1, 'Artista de Guion de Color', 'Color Script Artist'),
      (1, 'Artista de Layout', 'Layout Artist'),
      (1, 'Artista de Modelado', 'Modeling Artist'),
      (1, 'Artista de Texturas', 'Surfacing Artist'),
      (1, 'Artista de Rigging', 'Rigging Artist'),
      (1, 'Animador/a/e de Personajes', 'Character Animator'),
      (1, 'Animador/a/e 2D', '2D Animator'),
      (1, 'Animador/a/e 3D', '3D Animator'),
      (1, 'Responsable de Set Dressing', 'Set Dressing Artist'),
      (1, 'Ensamblador/a/e de Escenas', 'Scene Assembler'),
      (1, 'Artista de Character FX', 'FX Artist'),
      (1, 'Iluminador/a/e de Animación', 'Lighting Artist'),
      (1, 'Gestión de Render (Render Wrangler)', 'Render Wrangler'),
      (1, 'Artista de Matte Painting', 'Matte Painting Artist'),
      (1, 'Artista de Composición (Compositing)', 'Compositing Artist'),
      
      -- Dept. de Fotografía - Cámara - Iluminación (Category 2)
      (2, 'Dirección de Fotografía', 'Director of Photography'),
      (2, 'Operación de Cámara', 'Camera Operator'),
      (2, 'Primera Asistencia de Cámara', 'First Assistant Camera'),
      (2, 'Foquista', 'Focus Puller'),
      (2, 'Fotografía de Fija', 'Still Photographer'),
      (2, 'Personal de Electricidad', 'Electrician'),
      (2, 'Jefatura de Eléctricos (Gaffer)', 'Gaffer'),
      (2, 'Jefatura de Maquinistas (Key Grip)', 'Key Grip'),
      (2, 'Maquinista', 'Machinist / Grip'),
      (2, 'Operación de Estabilizador (Steadicam)', 'Steadicam Operator'),
      (2, 'Operación de Dron', 'Drone Operator'),
      (2, 'Especialista en Tomas Acuáticas', 'Underwater Camera Operator'),
      (2, 'Asistencia de Video (Video Assist)', 'Video Assist'),
      (2, 'Segunda Asistencia de Cámara', 'Second Assistant Camera'),
      (2, 'Asistencia de Gaffer (Best Boy Grip)', 'Best Boy Grip'),
      (2, 'Técnico/a/e de Imagen Digital (DIT)', 'Digital Imaging Technician (DIT)'),
      
      -- Departamento de Música y Sonido (Category 3)
      (3, 'Dirección de Orquesta', 'Orchestra Conductor'),
      (3, 'Diseño de Sonido', 'Sound Designer'),
      (3, 'Edición de Sonido', 'Sound Editor'),
      (3, 'Sonidista Directo', 'Production Sound Mixer'),
      (3, 'Especialista en Doblaje', 'Dubbing Specialist'),
      (3, 'Artista de Efectos de Sala (Foley)', 'Foley Artist'),
      (3, 'Operación de Boom / Microfonista', 'Boom Operator'),
      (3, 'Composición Musical', 'Composer'),
      (3, 'Mezcla de Sonido', 'Sound Mixer'),
      (3, 'Arreglista', 'Arranger'),
      (3, 'Montaje Musical', 'Music Editor'),
      (3, 'Posproducción de Sonido', 'Sound Post-production Specialist'),
      
      -- Dirección - Realización (Category 4) - Skip "Dirección" as it's already inserted with ID 1
      (4, 'Dirección de Actores', 'Acting Coach'),
      (4, 'Realización', 'TV Director'),
      (4, 'Asistencia de Dirección', 'Director''s Assistant'),
      (4, 'Continuista (Script)', 'Script Supervisor'),
      (4, 'Gestión de Datos (Data Manager)', 'Data Manager'),
      (4, 'Especialista en Documentación', 'Documentalist'),
      (4, 'Artista de Storyboard', 'Storyboard Artist'),
      (4, 'Coordinación de Dobles (Stunt Coordinator)', 'Stunt Coordinator'),
      
      -- Dirección de Arte (Category 5)
      (5, 'Dirección de Arte', 'Art Director'),
      (5, 'Diseño de Producción', 'Production Designer'),
      (5, 'Asistencia de Arte', 'Art Assistant'),
      (5, 'Escenografía', 'Set Designer'),
      (5, 'Asistencia de Escenografía', 'Set Designer Assistant'),
      (5, 'Decoración de Set', 'Set Dresser'),
      (5, 'Construcción (Key Scenic)', 'Key Scenic / Constructor'),
      (5, 'Maquillaje', 'Makeup Artist'),
      (5, 'Maquillaje de FX', 'Special Effects Makeup Artist'),
      (5, 'Peluquería', 'Hair Stylist'),
      (5, 'Vestuario', 'Costume Designer / Wardrobe'),
      (5, 'Utilería (Props)', 'Propmaster / Props'),
      (5, 'Especialista en Animales', 'Animal Wrangler'),
      (5, 'Tramoya', 'Stagehand'),
      (5, 'Diseño Gráfico', 'Graphic Designer'),
      
      -- Distribución (Category 6)
      (6, 'Distribución', 'Film Distributor'),
      (6, 'Agente de Ventas', 'Sales Agent'),
      (6, 'Relaciones Públicas', 'Public Relations Manager'),
      
      -- Edición y Postproducción de Imagen (Category 7)
      (7, 'Gerencia de Postproducción', 'Post-production Manager'),
      (7, 'Edición / Montaje', 'Editor'),
      (7, 'Asistencia de Edición', 'Assistant Editor'),
      (7, 'Especialista en VFX', 'Visual Effects Artist'),
      (7, 'Especialista en Efectos Especiales (FX)', 'Special Effects Artist'),
      (7, 'Especialista en Motion Graphics', 'Motion Graphics Specialist'),
      (7, 'Supervisión de CGI', 'CGI Supervisor'),
      (7, 'Colorista / Etalonador', 'Colorist'),
      (7, 'Artista Digital', 'Digital Artist'),
      (7, 'Subtitulado', 'Subtitler'),
      
      -- Elenco (Category 8) - Skip "Actuación" as it's already inserted with ID 20
      (8, 'Dirección de Casting', 'Casting Director'),
      (8, 'Extras', 'Background Talent / Extras'),
      (8, 'Doble de Riesgo', 'Stunt Performer'),
      (8, 'Presentación / Conducción', 'Host'),
      (8, 'Actuación de Voz', 'Voice Actor'),
      
      -- Exhibición (Category 9)
      (9, 'Administración de Sala', 'Cinema Administrator'),
      (9, 'Coordinación de Funciones Itinerantes', 'Traveling Showcase Manager'),
      
      -- Formación (Category 10)
      (10, 'Docencia', 'Professor / Teacher'),
      (10, 'Tallerista', 'Workshop Facilitator / Advisor'),
      
      -- Gestión Cultural (Category 11)
      (11, 'Gestión Cultural', 'Cultural Manager'),
      (11, 'Asesoría Cultural', 'Cultural Advisor'),
      (11, 'Producción de Eventos', 'Event Producer'),
      
      -- Guion (Category 12)
      (12, 'Guionista', 'Screenwriter'),
      (12, 'Investigación', 'Researcher'),
      
      -- Televisión (Category 13)
      (13, 'Dirección de Transmisión', 'Broadcast Director'),
      (13, 'Operación de Switcher', 'Switcher Operator'),
      (13, 'Operación de Control de Video', 'Video Control Operator'),
      (13, 'Operación de VTR', 'Video Tape Operator'),
      (13, 'Generación de Gráficos / Titulación', 'CG Operator / Title Designer'),
      (13, 'Master de Cabina de Control', 'Master Control Room Operator'),
      
      -- Producción (Category 14) - Skip "Producción" as it's already inserted with ID 2
      (14, 'Producción Ejecutiva', 'Executive Producer'),
      (14, 'Producción Asociada', 'Associate Producer'),
      (14, 'Gerencia de Producción', 'Production Manager'),
      (14, 'Jefatura de Piso', 'Floor Manager'),
      (14, 'Producción de Línea', 'Line Producer'),
      (14, 'Producción de Campo', 'Field Producer'),
      (14, 'Locacionista', 'Location Scout'),
      (14, 'Asistencia de Producción', 'Production Assistant'),
      (14, 'Realización de Making Of', 'Behind the Scenes / Making Of'),
      (14, 'Técnico/a de Gestión de Datos (DMT)', 'Data Management Technician'),
      
      -- Servicios Complementarios (Category 15)
      (15, 'Catering', 'Catering'),
      (15, 'Conducción / Transporte', 'Driver'),
      (15, 'Contabilidad Audiovisual', 'Production Accountant'),
      (15, 'Provisión de Equipos', 'Equipment Supplier'),
      (15, 'Traducción e Interpretación', 'Translator / Interpreter'),
      
      -- Videojuegos (Category 16)
      (16, 'Diseño de Juego', 'Game Designer'),
      (16, 'Programación de Juego', 'Game Programmer'),
      (16, 'Diseño de Niveles', 'Level Designer'),
      (16, 'Diseño de Narrativa', 'Narrative Designer'),
      (16, 'QA Testers (Control de Calidad)', 'QA Tester'),
      (16, 'Producción de Videojuegos', 'Game Producer'),
      (16, 'Artista Técnico (Technical Artist)', 'Technical Artist'),
      (16, 'Diseño de Interfaz (UI/UX)', 'UI/UX Designer'),
      
      -- Otros Servicios (Category 17)
      (17, 'Abogacía Audiovisual', 'Media Lawyer'),
      (17, 'Videojockey (VJ)', 'Videojockey'),
      (17, 'Reportería / Periodismo', 'Journalist'),
      (17, 'Agente de Aduanas', 'Customs Agent')
    `)

    // 8. Add foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" 
      ADD CONSTRAINT "FK_cinematic_roles_category" 
      FOREIGN KEY ("idRoleCategory") 
      REFERENCES "role_categories"("id") 
      ON DELETE NO ACTION 
      ON UPDATE NO ACTION
    `)

    // 9. Make idRoleCategory NOT NULL now that data is populated
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" 
      ALTER COLUMN "idRoleCategory" SET NOT NULL
    `)

    // 10. Reset sequence for role_categories
    await queryRunner.query(`
      SELECT setval(
        'role_categories_id_seq',
        COALESCE((SELECT MAX(id) FROM "role_categories"), 0) + 1,
        false
      )
    `)
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" DROP CONSTRAINT IF EXISTS "FK_cinematic_roles_category"
    `)

    // Remove new columns
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" DROP COLUMN IF EXISTS "nameEn"
    `)
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" DROP COLUMN IF EXISTS "idRoleCategory"
    `)

    // Drop role_categories table
    await queryRunner.query(`DROP TABLE IF EXISTS "role_categories"`)

    // Restore unique constraint on name
    await queryRunner.query(`
      ALTER TABLE "cinematic_roles" ADD CONSTRAINT "UQ_cinematic_roles_name" UNIQUE ("name")
    `)
  }
}
