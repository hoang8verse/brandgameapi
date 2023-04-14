/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable({schema: 'main', name: 'lb_arshooters'}, {
        id: 'id',
        user_app_id: { type: 'varchar(200)', notNull: true },
        user_name: { type: 'varchar(500)'},
        avatar: { type: 'varchar(500)'},
        gender: { type:'smallint'},
        score: { type:'bigint'},
                
        created_at: {
          type: 'timestamp',
          notNull: true,
          default: pgm.func('current_timestamp'),
        },
        updated_at: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
    })
};

exports.down = pgm => {
    pgm.dropTable({schema: 'main', name: 'lb_arshooters'})
};
