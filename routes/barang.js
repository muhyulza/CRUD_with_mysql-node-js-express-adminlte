var express = require('express');
var router = express.Router();
 
/* GET Barang page. */
 
router.get('/', function(req, res, next) {
 req.getConnection(function(err,connection){
 var query = connection.query('SELECT * FROM barang',function(err,rows)
 {
 if(err)
 var errornya  = ("Error Selecting : %s ",err );   
 req.flash('msg_error', errornya);   
 res.render('barang/list',{title:"Barang",data:rows});
 });
     });
});var express = require('express');
var router = express.Router();

/* GET Barang page. */

router.get('/', function(req, res, next) {
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang',function(err,rows)
		{
			if(err)
				var errornya  = ("Error Selecting : %s ",err );   
			req.flash('msg_error', errornya);   
			res.render('barang/list',{title:"Barang",data:rows});
		});
     });
});

router.post('/add', function(req, res, next) {
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {

		v_code = req.sanitize( 'code' ).escape().trim();
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_merk = req.sanitize( 'merk' ).escape().trim();
		v_amount = req.sanitize( 'amount' ).escape().trim();
        v_unit = req.sanitize( 'unit' ).escape();
        v_price = req.sanitize( 'price' ).escape().trim();

		var barang = {
            code: v_code,
            name: v_name,
            merk: v_merk,
			amount: v_amount,
			unit: v_unit,
			price : v_price
		}

		var insert_sql = 'INSERT INTO barang SET ?';
		req.getConnection(function(err,connection){
			var query = connection.query(insert_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Insert : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/add-barang', 
					{ 
						code: req.param('code'),
                        name: req.param('name'), 
                        merk: req.param('merk'),
                        amount: req.param('amount'),
						unit: req.param('unit'),
						price: req.param('price'),
					});
				}else{
					req.flash('msg_info', 'Create barang success'); 
					res.redirect('/barang');
				}		
			});
		});
	}else{
		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			name: req.param('name'), 
			unit: req.param('unit'),
		});
	}

});

router.get('/add', function(req, res, next) {
	res.render(	'barang/add-barang', 
	{ 
        title: 'Add New Barang',
        code: '',
        name: '',
        merk: '',
		amount: '',
		unit:'',
		price:''
	});
});

router.get('/edit/(:code)', function(req,res,next){
	req.getConnection(function(err,connection){
		var query = connection.query('SELECT * FROM barang where code='+req.params.code,function(err,rows)
		{
			if(err)
			{
				var errornya  = ("Error Selecting : %s ",err );  
				req.flash('msg_error', errors_detail); 
				res.redirect('/barang'); 
			}else
			{
				if(rows.length <=0)
				{
					req.flash('msg_error', "Barang can't be find!"); 
					res.redirect('/barang');
				}
				else
				{	
					console.log(rows);
					res.render('barang/edit',{title:"Edit ",data:rows[0]});

				}
			}

		});
	});
});
router.put('/edit/(:code)', function(req,res,next){
	req.assert('name', 'Please fill the name').notEmpty();
	var errors = req.validationErrors();
	if (!errors) {
        v_code = req.sanitize( 'code' ).escape().trim();
		v_name = req.sanitize( 'name' ).escape().trim(); 
		v_merk = req.sanitize( 'merk' ).escape().trim();
		v_amount = req.sanitize( 'amount' ).escape().trim();
        v_unit = req.sanitize( 'unit' ).escape();
        v_price = req.sanitize( 'price' ).escape().trim();

		var barang = {
            code: v_code,
            name: v_name,
            merk: v_merk,
			amount: v_amount,
			unit: v_unit,
			price : v_price
		}

		var update_sql = 'update barang SET ? where code = '+req.params.code;
		req.getConnection(function(err,connection){
			var query = connection.query(update_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Update : %s ",err );   
					req.flash('msg_error', errors_detail); 
					res.render('barang/edit', 
					{ 
                        code: req.param('code'),
                        name: req.param('name'), 
                        merk: req.param('merk'),
                        amount: req.param('amount'),
						unit: req.param('unit'),
						price: req.param('price'),
					});
				}else{
					req.flash('msg_info', 'Update barang success'); 
					res.redirect('/barang/edit/'+req.params.code);
				}		
			});
		});
	}else{

		console.log(errors);
		errors_detail = "Sory there are error<ul>";
		for (i in errors) 
		{ 
			error = errors[i]; 
			errors_detail += '<li>'+error.msg+'</li>'; 
		} 
		errors_detail += "</ul>"; 
		req.flash('msg_error', errors_detail); 
		res.render('barang/add-barang', 
		{ 
			name: req.param('name'), 
			unit: req.param('unit')
		});
	}
});

router.delete('/delete/(:code)', function(req, res, next) {
	req.getConnection(function(err,connection){
		var barang = {
			code: req.params.code,
		}
		
		var delete_sql = 'delete from barang where ?';
		req.getConnection(function(err,connection){
			var query = connection.query(delete_sql, barang, function(err, result){
				if(err)
				{
					var errors_detail  = ("Error Delete : %s ",err);
					req.flash('msg_error', errors_detail); 
					res.redirect('/barang');
				}
				else{
					req.flash('msg_info', 'Delete Barang Success'); 
					res.redirect('/barang');
				}
			});
		});
	});
});
module.exports = router;