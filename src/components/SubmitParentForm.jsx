import React, { Component } from 'react'
import FormControl from '@material-ui/core/FormControl';
import TextField from '@material-ui/core/TextField';
import Select from '@material-ui/core/Select';
import MenuItem from '@material-ui/core/MenuItem';
import InputLabel from '@material-ui/core/InputLabel';
import Button from '@material-ui/core/Button';
import {withStyles} from '@material-ui/core/styles';


const styles = theme => ({
  firstcolor: {
    color: '#eee'
  }
})
class SubmitParentForm extends Component {
  render() {
    const { treeData, input, classes, initialTypeSelection, setParentName, addParent, selectInitialType } = this.props;
    
    return (

        !treeData[0] && <form className='form' autoComplete='off'>
        {/* <InputLabel htmlFor='typeSelect'>Type</InputLabel> */}
        <FormControl className={classes.formControl}>
          <TextField
            InputProps={{
              className: classes.input
            }}
            label={<span style={{ color: 'white', fontSize: '13px', paddingLeft: '5px' }}>Name</span>}
            className={classes.textField}
            value={input}
            onChange={(e) => setParentName(e.target.value)}
            required={true}
          />
        </FormControl>
        <FormControl className={classes.formControl}>
          <Select
            className={classes.selectType}
            value={initialTypeSelection}
            displayEmpty
            onChange={(event) => {
              const selection = event.target.value;
              selectInitialType(selection)
            }}
            inputProps={{
              name: 'type',
              id: 'typeSelect',
              className: classes.input,
            }}
          >
            <MenuItem value='' className={classes.firstcolor}>Type</MenuItem>
            <MenuItem value={'Stack'} className={classes.menu}>Stack</MenuItem>
            <MenuItem value={'Drawer'} className={classes.menu}>Drawer</MenuItem>
            <MenuItem value={'BottomTab'} className={classes.menu}>BottomTab</MenuItem>
            <MenuItem value={'Switch'} className={classes.menu}>Switch</MenuItem>
          </Select>
          <Button type='submit' variant='contained' className={classes.addParentButton} onClick={(e) => {
            e.preventDefault();
            addParent();
          }}>
            <img src='./assets/add_parent.png'/>
          </Button> 
        </FormControl>
      </form>
    )
  }
}

export default SubmitParentForm