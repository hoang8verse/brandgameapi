/* eslint-disable camelcase */

exports.shorthands = undefined;

exports.up = pgm => {
    pgm.createTable({schema: 'main', name: 'lb_arshooters_event_vguys'}, {
        id: 'id',
        email: { type: 'varchar(200)', notNull: true },
        user_name: { type: 'varchar(500)'},
        phone_number: { type: 'varchar(20)'},
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
    pgm.dropTable({schema: 'main', name: 'lb_arshooters_event_vguy'})
};
