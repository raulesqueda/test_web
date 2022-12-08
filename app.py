from flask import Flask, render_template, request
from flask_sqlalchemy import SQLAlchemy

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'postgresql://dbcatastro:Catastro123!@dbcatastro.cpfstudlgevf.us-west-1.rds.amazonaws.com:5432/mydatabase'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)


class User(db.Model):
    nombre_col = db.Column(db.String(256), index=True)
    num_code = db.Column(db.Integer)
    prom_valor_unitario_suelo = db.Column(db.Integer)
    latitud = db.Column(db.Integer)
    longitud = db.Column(db.Integer)
    alcaldia = db.Column(db.String(256))
    estado = db.Column(db.String(256))

    def to_dict(self):
        return {
            'nombre_col': self.nombre_col,
            'num_code': self.num_code,
            'prom_valor_unitario_suelo': self.prom_valor_unitario_suelo,
            'alcaldia': self.alcaldia
        }

db.create_all()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/data')
def data():
    query = User.query

    # search filter
    search = request.args.get('search[value]')
    if search:
        query = query.filter(db.or_(
            User.nombre_col.like(f'%{search}%')
        ))
    total_filtered = query.count()

    # sorting
    order = []
    i = 0
    while True:
        col_index = request.args.get(f'order[{i}][column]')
        if col_index is None:
            break
        col_name = request.args.get(f'columns[{col_index}][data]')
        if col_name not in ['num_code', 'prom_valor_unitario_suelo', 'alcaldia']:
            col_name = 'prom_valor_unitario_suelo'
        descending = request.args.get(f'order[{i}][dir]') == 'desc'
        col = getattr(User, col_name)
        if descending:
            col = col.desc()
        order.append(col)
        i += 1
    if order:
        query = query.order_by(*order)

    # pagination
    start = request.args.get('start', type=int)
    length = request.args.get('length', type=int)
    query = query.offset(start).limit(length)

    # response
    return {
        'data': [user.to_dict() for user in query],
        'recordsFiltered': total_filtered,
        'recordsTotal': User.query.count(),
        'draw': request.args.get('draw', type=int),
    }


if __name__ == '__main__':
    app.run()