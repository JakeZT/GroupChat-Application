import * as mongoose from 'mongoose'
import * as chalk from 'chalk'
const db = 'chat'
export const ObjectId = mongoose.Types.ObjectId
mongoose.set('useCreateIndex', true)
mongoose.connect(`mongodb://127.0.0.1:27017/${db}`, { useNewUrlParser: true, useUnifiedTopology: true }, (err) => {
	if (err) {
		console.log(chalk.bgCyan(chalk.black(' S ')) + chalk.red(' Connect') + chalk.blue(` db.${db}`) + chalk.red(' failure'))
	} else {
		console.log(chalk.bgCyan(chalk.black(' S ')) + chalk.green(' Connect') + chalk.blue(` db.${db}`) + chalk.green(' successfully'))
	}
})
export default mongoose
